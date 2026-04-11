const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        website VARCHAR(500),
        service_interest VARCHAR(255),
        message TEXT NOT NULL,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS seo_checks (
        id SERIAL PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        performance_score INTEGER,
        seo_score INTEGER,
        accessibility_score INTEGER,
        best_practices_score INTEGER,
        raw_audits JSONB,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS quote_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        website VARCHAR(500),
        budget_range VARCHAR(100),
        services TEXT[],
        details TEXT,
        status VARCHAR(50) DEFAULT 'new',
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        author VARCHAR(255) DEFAULT 'Honey Bridge SEO',
        category VARCHAR(100),
        tags TEXT[],
        published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP,
        is_playbook BOOLEAN DEFAULT FALSE,
        playbook_part VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_seo_checks_url ON seo_checks(url);
      CREATE INDEX IF NOT EXISTS idx_seo_checks_created ON seo_checks(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);
      ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_playbook BOOLEAN DEFAULT FALSE;
      ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS playbook_part VARCHAR(50);
    `);

    // Seed sample blog posts using parameterized queries to avoid quote issues
    const { rows } = await client.query('SELECT COUNT(*) FROM blog_posts');
    if (parseInt(rows[0].count) === 0) {
      const posts = [
        {
          slug: 'why-seo-matters-2025',
          title: 'Why SEO Still Matters More Than Ever in 2025',
          excerpt: 'With AI-generated content flooding the web, standing out in search results requires more than keywords. Here is what actually moves the needle.',
          content: '<p>Search engine optimization has evolved dramatically. In 2025, the rules have changed but the stakes have never been higher.</p><p>With AI-generated content flooding the web, Google has doubled down on experience, expertise, authoritativeness, and trustworthiness. What this means for your business is that technical SEO and genuine authority signals now separate the winners from everyone else.</p><h2>Core Web Vitals Are Non-Negotiable</h2><p>Page speed, visual stability, and interactivity directly affect your rankings. A one-second delay in load time can reduce conversions by 7%.</p><h2>Content Depth Beats Content Volume</h2><p>Publishing ten shallow articles will not outperform one comprehensive, well-researched piece that genuinely answers user intent.</p>',
          category: 'Strategy',
          tags: ['SEO', '2025', 'Strategy'],
          daysAgo: 5
        },
        {
          slug: 'technical-seo-checklist',
          title: 'The Technical SEO Checklist Every Site Needs',
          excerpt: 'From crawlability to Core Web Vitals, this is the technical foundation your website needs before any content strategy will work.',
          content: '<p>Technical SEO is the foundation. No amount of great content will help if search engines cannot crawl and index your pages properly.</p><h2>Crawlability</h2><p>Make sure your robots.txt is not accidentally blocking important pages. Check your XML sitemap is up to date and submitted to Google Search Console.</p><h2>Page Speed</h2><p>Use a CDN, compress images to WebP, defer non-critical JavaScript, and eliminate render-blocking resources.</p><h2>Mobile-First</h2><p>Google indexes the mobile version of your site first. Test every page on real devices.</p><h2>Structured Data</h2><p>Schema markup helps search engines understand your content and can unlock rich results in the SERPs.</p>',
          category: 'Technical',
          tags: ['Technical SEO', 'Checklist', 'Performance'],
          daysAgo: 12
        },
        {
          slug: 'local-seo-guide',
          title: 'Local SEO: How to Dominate Your City Search Results',
          excerpt: 'If your business serves a local market, these strategies will put you in front of customers who are ready to buy right now.',
          content: '<p>Local SEO is one of the highest-ROI investments a local business can make. When someone searches for your service in your city, you want to be the first result they see.</p><h2>Google Business Profile</h2><p>Claim and fully optimize your listing. Add photos, respond to reviews, and post regular updates. This alone can dramatically increase local visibility.</p><h2>NAP Consistency</h2><p>Your Name, Address, and Phone number must be identical across every directory, your website, and social profiles.</p><h2>Local Citations</h2><p>Get listed in reputable local directories. Quality matters more than quantity.</p><h2>Reviews</h2><p>Actively ask satisfied customers for Google reviews. A steady stream of authentic reviews is a strong local ranking signal.</p>',
          category: 'Local SEO',
          tags: ['Local SEO', 'Google Business', 'Rankings'],
          daysAgo: 20
        }
      ];

      for (const post of posts) {
        const publishedAt = new Date();
        publishedAt.setDate(publishedAt.getDate() - post.daysAgo);
        await client.query(
          `INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, published, published_at)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7)
           ON CONFLICT (slug) DO NOTHING`,
          [post.slug, post.title, post.excerpt, post.content, post.category, post.tags, publishedAt]
        );
      }
    }

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  } finally {
    client.release();
  }
}

module.exports = { pool, initDb };
