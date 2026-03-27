const rateLimit = require('express-rate-limit');

const analyzeLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many SEO checks. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false
});

const contactLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

const quoteLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Too many quote requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { analyzeLimit, contactLimit, quoteLimit, generalLimit };
