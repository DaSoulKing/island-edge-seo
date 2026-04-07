require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const { initDb } = require('./db');
const { generalLimit } = require('./middleware/rateLimiter');
const {
  ipBlocker,
  suspiciousRequestDetector,
  bodySanitizer,
  fieldLengthGuard,
  hppProtection,
  additionalHeaders,
  requestSizeGuard,
  apiSlowDown,
} = require('./middleware/security');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com", "https://fonts.googleapis.com"],
      styleSrc:       ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:        ["'self'", "https://fonts.gstatic.com"],
      imgSrc:         ["'self'", "data:", "https:"],
      connectSrc:     ["'self'"],
      frameSrc:       ["https://www.google.com"],
      objectSrc:      ["'none'"],
      baseUri:        ["'self'"],
      formAction:     ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

app.use(additionalHeaders);

// Early blockers
app.use(ipBlocker);
app.use(suspiciousRequestDetector);
app.use(requestSizeGuard);

// Body parsing
app.use(express.json({ limit: '10kb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Input hardening
app.use(hppProtection);
app.use(bodySanitizer);
app.use(fieldLengthGuard(5000));

// Rate limiting
app.use(generalLimit);
app.use('/api/', apiSlowDown);

// Static files with caching headers
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (/\.(css|js|png|jpg|jpeg|webp|svg|woff2?)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

app.use((req, res, next) => {
  res.locals.recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY || '';
  next();
});

// API routes
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/forms',   require('./routes/forms'));
app.use('/api/blog',    require('./routes/blog'));
app.use('/admin',       require('./routes/admin'));

// Page routes
const pageMap = {
  '/': 'index', '/services': 'services', '/about': 'about',
  '/contact': 'contact', '/quote': 'quote', '/blog': 'blog',
};

Object.entries(pageMap).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${file}.html`));
  });
});

app.get('/blog/:slug', (req, res) => {
  const slug = req.params.slug.replace(/[^a-zA-Z0-9\-]/g, '');
  if (!slug) return res.status(400).end();
  res.sendFile(path.join(__dirname, 'public', 'blog-post.html'));
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler - never leak stack traces
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  res.status(500).json({ error: 'Something went wrong.' });
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`Honey Bridge SEO running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
