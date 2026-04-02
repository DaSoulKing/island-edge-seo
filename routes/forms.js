const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const { pool } = require('../db');
const { contactLimit, quoteLimit } = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');
const fetch = require('node-fetch');

let resend = null;
function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set. Add it to your environment variables.');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

async function verifyRecaptcha(token) {
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) return true;
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  const data = await res.json();
  return data.success && data.score >= 0.5;
}

// Contact form
router.post('/contact',
  contactLimit,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
    body('company').trim().optional().isLength({ max: 255 }),
    body('website').trim().optional().isURL().withMessage('Please enter a valid website URL')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, company, website, message, recaptchaToken } = req.body;

    if (process.env.NODE_ENV === 'production') {
      const valid = await verifyRecaptcha(recaptchaToken);
      if (!valid) return res.status(403).json({ error: 'reCAPTCHA verification failed.' });
    }

    try {
      // Save to DB
      await pool.query(
        `INSERT INTO contact_submissions (name, email, company, website, message, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, email, company || null, website || null, message, req.ip]
      );

      // Send notification email
      await getResend().emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `New Contact: ${name} via Island Edge SEO`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">New Contact Submission</h2>
            <table style="width:100%; border-collapse:collapse;">
              <tr><td style="padding:8px; font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
              <tr style="background:#f8f9fa;"><td style="padding:8px; font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px; font-weight:bold;">Company</td><td style="padding:8px;">${company}</td></tr>` : ''}
              ${website ? `<tr style="background:#f8f9fa;"><td style="padding:8px; font-weight:bold;">Website</td><td style="padding:8px;"><a href="${website}">${website}</a></td></tr>` : ''}
              <tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Message</td><td style="padding:8px;">${message.replace(/\n/g, '<br>')}</td></tr>
            </table>
            <p style="color:#888; font-size:12px; margin-top:24px;">Sent via Island Edge SEO contact form</p>
          </div>
        `
      });

      // Send confirmation to user
      await getResend().emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'We received your message - Island Edge SEO',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Thanks, ${name}.</h2>
            <p>We have received your message and will get back to you within one business day.</p>
            <p>In the meantime, feel free to check out our blog for tips and insights.</p>
            <p style="margin-top:32px; color:#888; font-size:13px;">
              Island Edge SEO<br>
              <a href="mailto:${process.env.EMAIL_FROM}" style="color:#0ea5e9;">${process.env.EMAIL_FROM}</a>
            </p>
          </div>
        `
      });

      res.json({ success: true, message: 'Message sent. We will be in touch within one business day.' });
    } catch (err) {
      console.error('Contact error:', err);
      res.status(500).json({ error: 'Failed to send message. Please try again or email us directly.' });
    }
  }
);

// Quote request
router.post('/quote',
  quoteLimit,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('services').isArray({ min: 1 }).withMessage('Please select at least one service'),
    body('details').trim().optional().isLength({ max: 5000 }),
    body('company').trim().optional(),
    body('website').trim().optional()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, company, website, budget_range, services, details, recaptchaToken } = req.body;

    if (process.env.NODE_ENV === 'production') {
      const valid = await verifyRecaptcha(recaptchaToken);
      if (!valid) return res.status(403).json({ error: 'reCAPTCHA verification failed.' });
    }

    try {
      await pool.query(
        `INSERT INTO quote_requests (name, email, company, website, budget_range, services, details, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [name, email, company || null, website || null, budget_range || null, services, details || null, req.ip]
      );

      await getResend().emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `New Quote Request: ${name} - Island Edge SEO`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">New Quote Request</h2>
            <table style="width:100%; border-collapse:collapse;">
              <tr><td style="padding:8px; font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
              <tr style="background:#f8f9fa;"><td style="padding:8px; font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px; font-weight:bold;">Company</td><td style="padding:8px;">${company}</td></tr>` : ''}
              ${website ? `<tr style="background:#f8f9fa;"><td style="padding:8px; font-weight:bold;">Website</td><td style="padding:8px;"><a href="${website}">${website}</a></td></tr>` : ''}
              ${budget_range ? `<tr><td style="padding:8px; font-weight:bold;">Budget Range</td><td style="padding:8px;">${budget_range}</td></tr>` : ''}
              <tr style="background:#f8f9fa;"><td style="padding:8px; font-weight:bold; vertical-align:top;">Services</td><td style="padding:8px;">${services.join(', ')}</td></tr>
              ${details ? `<tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Details</td><td style="padding:8px;">${details.replace(/\n/g, '<br>')}</td></tr>` : ''}
            </table>
            <p style="color:#888; font-size:12px; margin-top:24px;">Sent via Island Edge SEO quote form</p>
          </div>
        `
      });

      await getResend().emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your quote request - Island Edge SEO',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Quote request received, ${name}.</h2>
            <p>We have received your request and will prepare a tailored proposal within two business days.</p>
            <p>Services requested: <strong>${services.join(', ')}</strong></p>
            <p style="margin-top:32px; color:#888; font-size:13px;">
              Island Edge SEO<br>
              <a href="mailto:${process.env.EMAIL_FROM}" style="color:#0ea5e9;">${process.env.EMAIL_FROM}</a>
            </p>
          </div>
        `
      });

      res.json({ success: true, message: 'Quote request received. We will send a tailored proposal within two business days.' });
    } catch (err) {
      console.error('Quote error:', err);
      res.status(500).json({ error: 'Failed to submit quote request. Please try again.' });
    }
  }
);

module.exports = router;
