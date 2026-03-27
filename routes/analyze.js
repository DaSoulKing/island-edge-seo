const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { pool } = require('../db');
const { analyzeLimit } = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');

// Verify reCAPTCHA token
async function verifyRecaptcha(token) {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  const data = await res.json();
  return data.success && data.score >= 0.5;
}

router.post('/',
  analyzeLimit,
  [
    body('url')
      .trim()
      .notEmpty().withMessage('URL is required')
      .isURL({ require_protocol: true }).withMessage('Please enter a valid URL including http:// or https://')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { url, recaptchaToken } = req.body;

    // Verify reCAPTCHA in production
    if (process.env.NODE_ENV === 'production' && recaptchaToken) {
      const valid = await verifyRecaptcha(recaptchaToken);
      if (!valid) {
        return res.status(403).json({ error: 'reCAPTCHA verification failed. Please try again.' });
      }
    }

    try {
      const apiKey = process.env.PAGESPEED_API_KEY;
      const categories = ['performance', 'seo', 'accessibility', 'best-practices'];
      const params = new URLSearchParams({
        url,
        strategy: 'mobile',
        ...(apiKey && { key: apiKey })
      });
      categories.forEach(c => params.append('category', c));

      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;
      const response = await fetch(apiUrl, { timeout: 30000 });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = errData?.error?.message || 'Could not analyze this URL. Make sure the site is publicly accessible.';
        return res.status(400).json({ error: msg });
      }

      const data = await response.json();
      const cats = data.lighthouseResult?.categories || {};
      const audits = data.lighthouseResult?.audits || {};

      const scores = {
        performance: Math.round((cats.performance?.score || 0) * 100),
        seo: Math.round((cats.seo?.score || 0) * 100),
        accessibility: Math.round((cats.accessibility?.score || 0) * 100),
        bestPractices: Math.round((cats['best-practices']?.score || 0) * 100)
      };

      // Extract key SEO audits
      const seoAudits = [
        'document-title',
        'meta-description',
        'link-text',
        'crawlable-anchors',
        'is-crawlable',
        'robots-txt',
        'image-alt',
        'hreflang',
        'canonical',
        'font-size',
        'tap-targets',
        'structured-data'
      ].map(id => {
        const audit = audits[id];
        if (!audit) return null;
        return {
          id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          displayValue: audit.displayValue || null,
          passed: audit.score === 1
        };
      }).filter(Boolean);

      // Key performance audits
      const perfAudits = [
        'first-contentful-paint',
        'largest-contentful-paint',
        'total-blocking-time',
        'cumulative-layout-shift',
        'speed-index',
        'interactive'
      ].map(id => {
        const audit = audits[id];
        if (!audit) return null;
        return {
          id,
          title: audit.title,
          displayValue: audit.displayValue || 'N/A',
          score: audit.score
        };
      }).filter(Boolean);

      const result = {
        url,
        scores,
        seoAudits,
        perfAudits,
        fetchTime: data.analysisUTCTimestamp,
        strategy: 'mobile'
      };

      // Log to database
      try {
        await pool.query(
          `INSERT INTO seo_checks (url, performance_score, seo_score, accessibility_score, best_practices_score, raw_audits, ip_address)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [url, scores.performance, scores.seo, scores.accessibility, scores.bestPractices,
           JSON.stringify({ seoAudits, perfAudits }), req.ip]
        );
      } catch (dbErr) {
        console.error('DB log error:', dbErr.message);
      }

      res.json(result);
    } catch (err) {
      console.error('Analyze error:', err);
      res.status(500).json({ error: 'Analysis failed. Please try again in a moment.' });
    }
  }
);

module.exports = router;
