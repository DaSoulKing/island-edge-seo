const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const hpp = require('hpp');

/// ============================================================
/// IP BLOCKLIST - in-memory, resets on restart
/// For persistent blocking, move to DB or Redis
/// ============================================================
const blockedIPs = new Set();
const suspiciousActivity = new Map(); // ip -> { count, firstSeen }

const BLOCK_THRESHOLD = 50;        // suspicious hits before blocking
const BLOCK_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function trackSuspicious(ip) {
  const now = Date.now();
  const entry = suspiciousActivity.get(ip) || { count: 0, firstSeen: now };

  // Reset window if expired
  if (now - entry.firstSeen > BLOCK_WINDOW_MS) {
    entry.count = 0;
    entry.firstSeen = now;
  }

  entry.count++;
  suspiciousActivity.set(ip, entry);

  if (entry.count >= BLOCK_THRESHOLD) {
    blockedIPs.add(ip);
    console.warn(`[SECURITY] Blocked IP: ${ip} after ${entry.count} suspicious requests`);
  }
}

/// ============================================================
/// IP BLOCK CHECK
/// ============================================================
function ipBlocker(req, res, next) {
  const ip = req.ip;
  if (blockedIPs.has(ip)) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
}

/// ============================================================
/// SUSPICIOUS PATH DETECTOR
/// Catches common scanner/exploit patterns
/// ============================================================
const SUSPICIOUS_PATTERNS = [
  /\.\.\//,                          // path traversal
  /\.\.%2f/i,                        // encoded path traversal
  /%00/,                             // null bytes
  /\bselect\b.*\bfrom\b/i,           // SQL injection
  /\bunion\b.*\bselect\b/i,
  /\bdrop\b.*\btable\b/i,
  /\binsert\b.*\binto\b/i,
  /<script/i,                        // XSS in URL
  /javascript:/i,
  /vbscript:/i,
  /onload=/i,
  /onerror=/i,
  /\/wp-admin/i,                     // WordPress scanners
  /\/wp-login/i,
  /\/xmlrpc/i,
  /\/phpmyadmin/i,
  /\/\.env/,                         // env file probing
  /\/\.git/,                         // git exposure
  /\/etc\/passwd/,                   // unix file probing
  /\/proc\/self/,
  /cmd\.exe/i,                       // Windows shell injection
  /powershell/i,
  /\beval\b.*\(/i,                   // eval injection
  /base64_decode/i,
  /system\(/i,
  /exec\(/i,
];

function suspiciousRequestDetector(req, res, next) {
  const url = decodeURIComponent(req.originalUrl || '');
  const ua = req.headers['user-agent'] || '';

  const isSuspicious = SUSPICIOUS_PATTERNS.some(p => p.test(url)) ||
    SUSPICIOUS_PATTERNS.some(p => p.test(ua));

  if (isSuspicious) {
    trackSuspicious(req.ip);
    console.warn(`[SECURITY] Suspicious request from ${req.ip}: ${req.method} ${req.originalUrl.slice(0, 120)}`);
    return res.status(400).json({ error: 'Bad request.' });
  }

  next();
}

/// ============================================================
/// BODY SANITIZER - strip dangerous characters from req.body
/// Works alongside parameterized queries as a second layer
/// ============================================================
function sanitizeBody(obj, depth = 0) {
  if (depth > 5) return obj;
  if (typeof obj === 'string') {
    // Strip null bytes and control characters
    return obj.replace(/\x00/g, '').replace(/[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
  }
  if (Array.isArray(obj)) {
    return obj.map(v => sanitizeBody(v, depth + 1));
  }
  if (obj && typeof obj === 'object') {
    const clean = {};
    for (const key of Object.keys(obj)) {
      const cleanKey = key.replace(/[^\w\s\-@.]/g, '');
      clean[cleanKey] = sanitizeBody(obj[key], depth + 1);
    }
    return clean;
  }
  return obj;
}

function bodySanitizer(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeBody(req.body);
  }
  next();
}

/// ============================================================
/// FIELD LENGTH ENFORCER
/// Hard max lengths regardless of validator settings
/// ============================================================
function fieldLengthGuard(maxLength = 10000) {
  return (req, res, next) => {
    if (!req.body) return next();
    for (const [key, val] of Object.entries(req.body)) {
      if (typeof val === 'string' && val.length > maxLength) {
        return res.status(400).json({ error: `Field "${key}" exceeds maximum allowed length.` });
      }
    }
    next();
  };
}

/// ============================================================
/// ADMIN BRUTE FORCE PROTECTION
/// Slow down + lockout on repeated failed logins
/// ============================================================
const adminLoginAttempts = new Map(); // ip -> { count, lockedUntil }
const ADMIN_MAX_ATTEMPTS = 5;
const ADMIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function adminBruteForceGuard(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const record = adminLoginAttempts.get(ip) || { count: 0, lockedUntil: 0 };

  if (record.lockedUntil && now < record.lockedUntil) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return res.redirect(`/admin/login?error=locked&minutes=${minutesLeft}`);
  }

  // Attach a fail reporter to the request for the route to call
  req.reportFailedLogin = () => {
    record.count++;
    if (record.count >= ADMIN_MAX_ATTEMPTS) {
      record.lockedUntil = now + ADMIN_LOCKOUT_MS;
      record.count = 0;
      console.warn(`[SECURITY] Admin login locked for IP: ${ip}`);
    }
    adminLoginAttempts.set(ip, record);
  };

  req.reportSuccessfulLogin = () => {
    adminLoginAttempts.delete(ip);
  };

  next();
}

/// ============================================================
/// SLOW DOWN - progressively delays repeat requesters
/// ============================================================
const apiSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 20,
  delayMs: (used) => (used - 20) * 200,
  maxDelayMs: 5000,
});

const adminSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  delayMs: (used) => (used - 5) * 500,
  maxDelayMs: 10000,
});

/// ============================================================
/// HTTP PARAMETER POLLUTION
/// ============================================================
const hppProtection = hpp({
  whitelist: ['services', 'tags', 'category'] // arrays allowed in forms
});

/// ============================================================
/// REFERRER POLICY & ADDITIONAL HEADERS
/// (helmet handles most, this covers what helmet misses)
/// ============================================================
function additionalHeaders(req, res, next) {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
}

/// ============================================================
/// REQUEST SIZE GUARD - extra check beyond express limits
/// ============================================================
function requestSizeGuard(req, res, next) {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > 50 * 1024) { // 50kb hard cap
    return res.status(413).json({ error: 'Request too large.' });
  }
  next();
}

module.exports = {
  ipBlocker,
  suspiciousRequestDetector,
  bodySanitizer,
  fieldLengthGuard,
  adminBruteForceGuard,
  apiSlowDown,
  adminSlowDown,
  hppProtection,
  additionalHeaders,
  requestSizeGuard,
};
