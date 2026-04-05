# Honey Bridge SEO - Website Template

A full-stack SEO agency website built with Node.js, Express, PostgreSQL, and vanilla HTML/CSS/JS.

---

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Email**: Resend
- **Spam protection**: Google reCAPTCHA v3
- **SEO scoring**: Google PageSpeed Insights API
- **Frontend**: HTML, CSS, Vanilla JS (no framework)

---

## Project Structure

```
island-edge-seo/
├── server.js               # Entry point
├── package.json
├── .env.example            # Copy to .env and fill in
├── db/
│   └── index.js            # DB pool and schema init
├── middleware/
│   └── rateLimiter.js      # Rate limiting per route
├── routes/
│   ├── analyze.js          # POST /api/analyze
│   ├── forms.js            # POST /api/forms/contact and /quote
│   └── blog.js             # GET /api/blog and /api/blog/:slug
└── public/
    ├── index.html          # Home / hero / SEO checker
    ├── services.html
    ├── about.html
    ├── contact.html
    ├── quote.html
    ├── blog.html
    ├── blog-post.html
    ├── 404.html
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then fill in `.env`:

```
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://user:password@localhost:5432/island_edge_seo

PAGESPEED_API_KEY=your_key_here
RECAPTCHA_SECRET_KEY=your_secret_here
RECAPTCHA_SITE_KEY=your_site_key_here

RESEND_API_KEY=your_resend_key_here
EMAIL_FROM=hello@islandedgeseo.com
EMAIL_TO=contact@islandedgeseo.com
```

### 3. Create the PostgreSQL database

```bash
createdb island_edge_seo
```

The schema creates itself on first run via `db/index.js`.

### 4. Add reCAPTCHA site key to HTML pages

In `index.html`, `contact.html`, and `quote.html` there is a script tag:

```html
<script>window.RECAPTCHA_SITE_KEY = '{{RECAPTCHA_SITE_KEY}}';</script>
```

Replace `{{RECAPTCHA_SITE_KEY}}` with your actual reCAPTCHA v3 site key. You can either do this manually or wire it through a templating engine later.

Also add the reCAPTCHA script tag to those pages if you want it active:

```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY" async defer></script>
```

### 5. Run in development

```bash
npm run dev
```

### 6. Run in production

```bash
NODE_ENV=production npm start
```

---

## API Keys

### Google PageSpeed Insights API

1. Go to https://console.cloud.google.com
2. Enable the PageSpeed Insights API
3. Create an API key under Credentials
4. Add to `.env` as `PAGESPEED_API_KEY`

The API works without a key but is rate-limited. A key gives you 25,000 requests/day free.

### Google reCAPTCHA v3

1. Go to https://www.google.com/recaptcha/admin
2. Register a new site, choose reCAPTCHA v3
3. Add your domain(s)
4. Copy the site key and secret key to `.env`

### Resend

1. Go to https://resend.com and create an account
2. Add and verify your sending domain
3. Create an API key
4. Add to `.env` as `RESEND_API_KEY`
5. Update `EMAIL_FROM` to match your verified domain

---

## Database Tables

| Table | Purpose |
|---|---|
| `contact_submissions` | Contact form entries |
| `quote_requests` | Quote form entries with service selection |
| `seo_checks` | Logged SEO checker results (useful lead data) |
| `blog_posts` | CMS-style blog with published/draft state |

The DB seeds three sample blog posts on first run.

---

## Adding Blog Posts

Blog posts live in the `blog_posts` table. To add a post, insert directly into PostgreSQL:

```sql
INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, published, published_at)
VALUES (
  'my-post-slug',
  'My Post Title',
  'Short excerpt shown on listing page.',
  '<p>Full HTML content here...</p>',
  'Technical',
  ARRAY['SEO', 'Technical'],
  TRUE,
  NOW()
);
```

A simple admin interface for blog management can be added as a later phase.

---

## Rate Limits

| Endpoint | Limit |
|---|---|
| `/api/analyze` | 10 requests per 15 minutes per IP |
| `/api/forms/contact` | 5 per hour per IP |
| `/api/forms/quote` | 3 per hour per IP |
| All routes (general) | 200 per 15 minutes per IP |

---

## Replacing "Honey Bridge SEO"

All instances of the brand name are exactly `Honey Bridge SEO` with no variations, possessives, or abbreviations. Use your editor find-and-replace to swap it globally.

---

## Production Checklist

- [ ] Set `NODE_ENV=production` in your environment
- [ ] Use a process manager like PM2: `pm2 start server.js`
- [ ] Put Nginx or Caddy in front for SSL termination
- [ ] Set up database backups
- [ ] Replace all `{{RECAPTCHA_SITE_KEY}}` placeholders in HTML files
- [ ] Verify Resend domain and update `EMAIL_FROM`
- [ ] Add your actual domain to the reCAPTCHA admin console
- [ ] Review and tighten the CSP headers in `server.js` for your domain

---

## Using a Squarespace Domain with Railway

Squarespace can host your domain even though the backend runs on Railway. Here is how to connect them:

1. In Railway, go to your service, click **Settings**, then **Domains**, then **Add Custom Domain**
2. Type your domain (e.g. `honeybridgeseo.com`) and Railway will show you a CNAME record to add
3. In Squarespace, go to **Settings**, then **Domains**, click your domain, then **DNS Settings**
4. Add a CNAME record with the name `www` pointing to the value Railway gave you
5. For the root domain (`honeybridgeseo.com` without www), add an ALIAS or ANAME record pointing to Railway, or redirect it to the www version in Squarespace

DNS changes take up to 48 hours to propagate but usually happen within an hour.

---

## Logo

Drop your logo file at:

  public/images/logo.png

Transparent PNG, horizontal format, dark-background-friendly. The nav displays it at 38px height automatically.

---

## SEO Playbook (Blog)

The blog is now called SEO Playbook throughout the site. The URL stays `/blog` for simplicity. All nav links, page titles, and section headers reflect the new name.

---

## Score Thresholds

The SEO checker uses the following colour coding:
- Green: 98 and above
- Yellow: 80 to 97
- Red: below 80

This reflects the non-linear nature of SEO. A score of 80 is not 80 percent of perfect. It can mean a fraction of the traffic that a score of 98 receives.
