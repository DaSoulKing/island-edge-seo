require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const { initDb } = require('./db');
const { generalLimit } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://www.google.com",
        "https://www.gstatic.com",
        "https://fonts.googleapis.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["https://www.google.com"]
    }
  }
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(generalLimit);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Pass recaptcha site key to all page renders
app.use((req, res, next) => {
  res.locals.recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY || '';
  next();
});

// API routes
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/forms', require('./routes/forms'));
app.use('/api/blog', require('./routes/blog'));
// Admin panel
app.use('/admin', require('./routes/admin'));

// Page routes - serve HTML files
const pages = ['/', '/services', '/about', '/contact', '/quote', '/blog'];
const pageMap = {
  '/': 'index',
  '/services': 'services',
  '/about': 'about',
  '/contact': 'contact',
  '/quote': 'quote',
  '/blog': 'blog'
};

pages.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${pageMap[route]}.html`));
  });
});

app.get('/blog/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog-post.html'));
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.' });
});

// Init DB then start
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Island Edge SEO running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
