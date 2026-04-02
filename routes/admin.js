const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Simple password middleware - checks session token via cookie
function requireAdmin(req, res, next) {
  const token = req.cookies?.adminToken;
  if (token && token === process.env.ADMIN_SECRET) {
    return next();
  }
  // Allow login page through
  if (req.path === '/login' || req.path === '/login/submit') {
    return next();
  }
  res.redirect('/admin/login');
}

// Parse cookies manually (no cookie-parser dep needed)
router.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [key, ...val] = cookie.trim().split('=');
      req.cookies[key.trim()] = decodeURIComponent(val.join('='));
    });
  }
  next();
});

router.use(requireAdmin);
// Safely convert postgres array (may come back as string or real array)
function parsePgArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  // Postgres returns {a,b,c} format
  return String(val).replace(/^{|}$/g, '').split(',').map(s => s.replace(/^"|"$/g, '').trim()).filter(Boolean);
}



// ============================================================
// LOGIN
// ============================================================
router.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login - Island Edge SEO</title>
  <link rel="stylesheet" href="/css/style.css">
  <style>
    .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .login-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 48px 40px; width: 100%; max-width: 400px; backdrop-filter: blur(8px); }
    .login-logo { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--white); margin-bottom: 8px; }
    .login-logo span { color: var(--blue); }
    .login-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 32px; }
    .login-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius); padding: 10px 14px; color: #fca5a5; font-size: 0.82rem; margin-bottom: 16px; display: ${req.query.error ? 'block' : 'none'}; }
  </style>
</head>
<body>
<div class="login-wrap">
  <div class="login-card">
    <div class="login-logo">Island Edge <span>SEO</span></div>
    <div class="login-sub">Admin access only.</div>
    <div class="login-error">Incorrect password. Try again.</div>
    <form method="POST" action="/admin/login/submit">
      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <input type="password" id="password" name="password" class="form-input" placeholder="Enter admin password" autofocus required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:8px;">Sign In</button>
    </form>
  </div>
</div>
</body>
</html>`);
});

router.post('/login/submit', express.urlencoded({ extended: false }), (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_SECRET) {
    res.setHeader('Set-Cookie', `adminToken=${process.env.ADMIN_SECRET}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);
    res.redirect('/admin');
  } else {
    res.redirect('/admin/login?error=1');
  }
});

router.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'adminToken=; HttpOnly; Path=/; Max-Age=0');
  res.redirect('/admin/login');
});

// ============================================================
// SHARED LAYOUT HELPER
// ============================================================
function layout(title, body, activeNav) {
  const navItems = [
    { href: '/admin', label: 'Dashboard', key: 'dashboard' },
    { href: '/admin/blog', label: 'Blog Posts', key: 'blog' },
    { href: '/admin/submissions', label: 'Contact', key: 'submissions' },
    { href: '/admin/quotes', label: 'Quotes', key: 'quotes' },
    { href: '/admin/seo-checks', label: 'SEO Checks', key: 'seo' },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Admin</title>
  <link rel="stylesheet" href="/css/style.css">
  <style>
    body { display: flex; min-height: 100vh; }
    .admin-sidebar {
      width: 220px; flex-shrink: 0;
      background: var(--navy-mid);
      border-right: 1px solid var(--border);
      padding: 28px 0;
      display: flex; flex-direction: column;
      position: fixed; top: 0; left: 0; bottom: 0;
    }
    .admin-logo { font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: var(--white); padding: 0 20px 24px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
    .admin-logo span { color: var(--blue); }
    .admin-logo small { display: block; font-size: 0.68rem; color: var(--muted); font-family: var(--font-body); font-weight: 400; margin-top: 2px; letter-spacing: 0.05em; text-transform: uppercase; }
    .admin-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 12px; flex: 1; }
    .admin-nav a { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--radius); font-size: 0.85rem; color: var(--muted); transition: all var(--transition); text-decoration: none; }
    .admin-nav a:hover { color: var(--white); background: rgba(255,255,255,0.05); }
    .admin-nav a.active { color: var(--white); background: rgba(14,165,233,0.12); }
    .admin-nav a.active { border-left: 2px solid var(--blue); padding-left: 10px; }
    .admin-signout { padding: 16px 20px 0; border-top: 1px solid var(--border); margin-top: auto; }
    .admin-signout a { font-size: 0.78rem; color: var(--muted); }
    .admin-signout a:hover { color: #ef4444; }
    .admin-main { margin-left: 220px; flex: 1; padding: 40px; min-height: 100vh; }
    .admin-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .admin-page-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th { text-align: left; padding: 10px 14px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); border-bottom: 1px solid var(--border); }
    .admin-table td { padding: 12px 14px; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
    .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
    .badge-green { background: rgba(34,197,94,0.12); color: #86efac; }
    .badge-yellow { background: rgba(245,158,11,0.12); color: #fcd34d; }
    .badge-blue { background: rgba(14,165,233,0.12); color: #7dd3fc; }
    .admin-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; backdrop-filter: blur(8px); }
    .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-box { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
    .stat-box-num { font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--blue); }
    .stat-box-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-top: 4px; }
    .admin-form .form-group { margin-bottom: 18px; }
    .view-link { color: var(--blue); font-size: 0.78rem; }
    .action-btn { padding: 5px 12px; border-radius: var(--radius); font-size: 0.75rem; font-weight: 600; cursor: pointer; border: none; font-family: var(--font-body); transition: all var(--transition); }
    .btn-danger { background: rgba(239,68,68,0.15); color: #fca5a5; }
    .btn-danger:hover { background: rgba(239,68,68,0.3); }
    .btn-success { background: rgba(34,197,94,0.15); color: #86efac; }
    .btn-success:hover { background: rgba(34,197,94,0.3); }
    .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 0.875rem; }
    .msg-preview { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--muted); }
    @media (max-width: 768px) {
      .admin-sidebar { width: 100%; position: relative; height: auto; }
      .admin-main { margin-left: 0; padding: 20px; }
      body { flex-direction: column; }
      .stat-row { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
<aside class="admin-sidebar">
  <div class="admin-logo">Island Edge <span>SEO</span><small>Admin Panel</small></div>
  <nav class="admin-nav">
    ${navItems.map(item => `<a href="${item.href}" class="${activeNav === item.key ? 'active' : ''}">${item.label}</a>`).join('')}
    <a href="/" target="_blank" style="margin-top:8px;">View Site</a>
  </nav>
  <div class="admin-signout"><a href="/admin/logout">Sign Out</a></div>
</aside>
<main class="admin-main">
  ${body}
</main>
</body>
</html>`;
}

// ============================================================
// DASHBOARD
// ============================================================
router.get('/', async (req, res) => {
  try {
    const [contacts, quotes, seoChecks, posts] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM contact_submissions'),
      pool.query('SELECT COUNT(*) FROM quote_requests'),
      pool.query('SELECT COUNT(*) FROM seo_checks'),
      pool.query('SELECT COUNT(*) FROM blog_posts WHERE published = TRUE')
    ]);

    const recentContacts = await pool.query(
      'SELECT name, email, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 5'
    );
    const recentQuotes = await pool.query(
      'SELECT name, email, services, status, created_at FROM quote_requests ORDER BY created_at DESC LIMIT 5'
    );

    const body = `
      <div class="admin-topbar">
        <h1 class="admin-page-title">Dashboard</h1>
        <span style="font-size:0.8rem; color:var(--muted);">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div class="stat-row">
        <div class="stat-box"><div class="stat-box-num">${contacts.rows[0].count}</div><div class="stat-box-label">Contact Submissions</div></div>
        <div class="stat-box"><div class="stat-box-num">${quotes.rows[0].count}</div><div class="stat-box-label">Quote Requests</div></div>
        <div class="stat-box"><div class="stat-box-num">${seoChecks.rows[0].count}</div><div class="stat-box-label">SEO Checks Run</div></div>
        <div class="stat-box"><div class="stat-box-num">${posts.rows[0].count}</div><div class="stat-box-label">Published Posts</div></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div class="admin-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700;">Recent Contacts</h3>
            <a href="/admin/submissions" class="view-link">View all</a>
          </div>
          ${recentContacts.rows.length ? `
          <table class="admin-table">
            <thead><tr><th>Name</th><th>Date</th></tr></thead>
            <tbody>
              ${recentContacts.rows.map(r => `<tr><td>${r.name}<br><span style="color:var(--muted);font-size:0.75rem;">${r.email}</span></td><td style="color:var(--muted);font-size:0.78rem;">${new Date(r.created_at).toLocaleDateString()}</td></tr>`).join('')}
            </tbody>
          </table>` : '<div class="empty-state">No submissions yet.</div>'}
        </div>
        <div class="admin-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-family:var(--font-display); font-size:0.95rem; font-weight:700;">Recent Quotes</h3>
            <a href="/admin/quotes" class="view-link">View all</a>
          </div>
          ${recentQuotes.rows.length ? `
          <table class="admin-table">
            <thead><tr><th>Name</th><th>Status</th></tr></thead>
            <tbody>
              ${recentQuotes.rows.map(r => `<tr><td>${r.name}<br><span style="color:var(--muted);font-size:0.75rem;">${r.email}</span></td><td><span class="badge badge-${r.status === 'new' ? 'blue' : 'green'}">${r.status}</span></td></tr>`).join('')}
            </tbody>
          </table>` : '<div class="empty-state">No quote requests yet.</div>'}
        </div>
      </div>
    `;
    res.send(layout('Dashboard', body, 'dashboard'));
  } catch (err) {
    res.send(layout('Dashboard', `<p style="color:#fca5a5;">Database error: ${err.message}</p>`, 'dashboard'));
  }
});

// ============================================================
// BLOG - list
// ============================================================
router.get('/blog', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
  const body = `
    <div class="admin-topbar">
      <h1 class="admin-page-title">Blog Posts</h1>
      <a href="/admin/blog/new" class="btn btn-primary" style="font-size:0.85rem; padding:10px 20px;">New Post</a>
    </div>
    <div class="admin-card">
      ${rows.length ? `
      <table class="admin-table">
        <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${rows.map(p => `
            <tr>
              <td><a href="/admin/blog/edit/${p.id}" style="color:var(--white); font-weight:500;">${p.title}</a></td>
              <td><span style="color:var(--muted); font-size:0.8rem;">${p.category || '-'}</span></td>
              <td><span class="badge ${p.published ? 'badge-green' : 'badge-yellow'}">${p.published ? 'Published' : 'Draft'}</span></td>
              <td style="color:var(--muted); font-size:0.78rem;">${new Date(p.created_at).toLocaleDateString()}</td>
              <td style="display:flex; gap:6px; flex-wrap:wrap;">
                <a href="/admin/blog/edit/${p.id}" class="action-btn" style="background:rgba(14,165,233,0.1); color:#7dd3fc;">Edit</a>
                <form method="POST" action="/admin/blog/toggle/${p.id}" style="display:inline;">
                  <button class="action-btn ${p.published ? 'btn-danger' : 'btn-success'}">${p.published ? 'Unpublish' : 'Publish'}</button>
                </form>
                <form method="POST" action="/admin/blog/delete/${p.id}" style="display:inline;" onsubmit="return confirm('Delete this post?')">
                  <button class="action-btn btn-danger">Delete</button>
                </form>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>` : '<div class="empty-state">No posts yet. <a href="/admin/blog/new" style="color:var(--blue);">Create your first post.</a></div>'}
    </div>
  `;
  res.send(layout('Blog Posts', body, 'blog'));
});

// ============================================================
// BLOG - new post form
// ============================================================
function blogForm(post = {}, action, error = '') {
  return `
    <div class="admin-topbar">
      <h1 class="admin-page-title">${post.id ? 'Edit Post' : 'New Post'}</h1>
      <a href="/admin/blog" style="font-size:0.85rem; color:var(--muted);">Back to Posts</a>
    </div>
    ${error ? `<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:var(--radius);padding:12px 16px;color:#fca5a5;font-size:0.82rem;margin-bottom:20px;">${error}</div>` : ''}
    <div class="admin-card admin-form">
      <form method="POST" action="${action}">
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:20px;">
          <div>
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input type="text" name="title" class="form-input" value="${post.title || ''}" required placeholder="Post title">
            </div>
            <div class="form-group">
              <label class="form-label">Slug * <span style="font-size:0.72rem; color:var(--muted);">(URL path, e.g. my-post-title)</span></label>
              <input type="text" name="slug" class="form-input" value="${post.slug || ''}" required placeholder="my-post-title">
            </div>
            <div class="form-group">
              <label class="form-label">Excerpt <span style="font-size:0.72rem; color:var(--muted);">(shown on blog listing)</span></label>
              <textarea name="excerpt" class="form-textarea" style="min-height:80px;" placeholder="Short summary of the post...">${post.excerpt || ''}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Content * <span style="font-size:0.72rem; color:var(--muted);">(HTML supported)</span></label>
              <textarea name="content" class="form-textarea" style="min-height:320px;" required placeholder="&lt;p&gt;Write your post content here. HTML tags are supported.&lt;/p&gt;">${post.content || ''}</textarea>
            </div>
          </div>
          <div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select name="category" class="form-select">
                <option value="">None</option>
                ${['Strategy','Technical','Local SEO','Content','Link Building','E-commerce'].map(c => `<option value="${c}" ${post.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tags <span style="font-size:0.72rem; color:var(--muted);">(comma separated)</span></label>
              <input type="text" name="tags" class="form-input" value="${parsePgArray(post.tags).join(', ')}" placeholder="SEO, Technical, 2025">
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select name="published" class="form-select">
                <option value="false" ${!post.published ? 'selected' : ''}>Draft</option>
                <option value="true" ${post.published ? 'selected' : ''}>Published</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Author</label>
              <input type="text" name="author" class="form-input" value="${post.author || 'Island Edge SEO'}" placeholder="Island Edge SEO">
            </div>
          </div>
        </div>
        <div style="display:flex; gap:12px; margin-top:8px;">
          <button type="submit" class="btn btn-primary">${post.id ? 'Save Changes' : 'Create Post'}</button>
          <a href="/admin/blog" class="btn btn-ghost">Cancel</a>
        </div>
      </form>
    </div>
  `;
}

router.get('/blog/new', (req, res) => {
  res.send(layout('New Post', blogForm({}, '/admin/blog/create'), 'blog'));
});

router.post('/blog/create', express.urlencoded({ extended: true }), async (req, res) => {
  const { title, slug, excerpt, content, category, tags, published, author } = req.body;
  const tagsArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  try {
    await pool.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, published, author, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [title, slug, excerpt || null, content, category || null, tagsArr,
       published === 'true', author || 'Island Edge SEO',
       published === 'true' ? new Date() : null]
    );
    res.redirect('/admin/blog');
  } catch (err) {
    res.send(layout('New Post', blogForm(req.body, '/admin/blog/create', err.message), 'blog'));
  }
});

router.get('/blog/edit/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/blog');
  res.send(layout('Edit Post', blogForm(rows[0], `/admin/blog/update/${req.params.id}`), 'blog'));
});

router.post('/blog/update/:id', express.urlencoded({ extended: true }), async (req, res) => {
  const { title, slug, excerpt, content, category, tags, published, author } = req.body;
  const tagsArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  try {
    const current = await pool.query('SELECT published, published_at FROM blog_posts WHERE id = $1', [req.params.id]);
    const wasPublished = current.rows[0]?.published;
    const publishedAt = (published === 'true' && !wasPublished) ? new Date() : current.rows[0]?.published_at;
    await pool.query(
      `UPDATE blog_posts SET title=$1, slug=$2, excerpt=$3, content=$4, category=$5, tags=$6,
       published=$7, author=$8, published_at=$9, updated_at=NOW() WHERE id=$10`,
      [title, slug, excerpt || null, content, category || null, tagsArr,
       published === 'true', author || 'Island Edge SEO', publishedAt, req.params.id]
    );
    res.redirect('/admin/blog');
  } catch (err) {
    const { rows } = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
    res.send(layout('Edit Post', blogForm({ ...rows[0], ...req.body }, `/admin/blog/update/${req.params.id}`, err.message), 'blog'));
  }
});

router.post('/blog/toggle/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT published FROM blog_posts WHERE id = $1', [req.params.id]);
  const newState = !rows[0].published;
  await pool.query('UPDATE blog_posts SET published=$1, published_at=$2 WHERE id=$3',
    [newState, newState ? new Date() : null, req.params.id]);
  res.redirect('/admin/blog');
});

router.post('/blog/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM blog_posts WHERE id = $1', [req.params.id]);
  res.redirect('/admin/blog');
});

// ============================================================
// CONTACT SUBMISSIONS
// ============================================================
router.get('/submissions', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
  const body = `
    <div class="admin-topbar">
      <h1 class="admin-page-title">Contact Submissions</h1>
      <span style="font-size:0.82rem; color:var(--muted);">${rows.length} total</span>
    </div>
    <div class="admin-card">
      ${rows.length ? `
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Website</th><th>Message</th><th>Date</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.name}${r.company ? `<br><span style="color:var(--muted);font-size:0.75rem;">${r.company}</span>` : ''}</td>
              <td><a href="mailto:${r.email}" style="color:var(--blue); font-size:0.85rem;">${r.email}</a></td>
              <td>${r.website ? `<a href="${r.website}" target="_blank" class="view-link">${r.website.replace('https://','').replace('http://','')}</a>` : '<span style="color:var(--muted);">-</span>'}</td>
              <td><div class="msg-preview">${r.message}</div></td>
              <td style="color:var(--muted); font-size:0.78rem; white-space:nowrap;">${new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>` : '<div class="empty-state">No contact submissions yet.</div>'}
    </div>
  `;
  res.send(layout('Contact Submissions', body, 'submissions'));
});

// ============================================================
// QUOTE REQUESTS
// ============================================================
router.get('/quotes', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM quote_requests ORDER BY created_at DESC');
  const body = `
    <div class="admin-topbar">
      <h1 class="admin-page-title">Quote Requests</h1>
      <span style="font-size:0.82rem; color:var(--muted);">${rows.length} total</span>
    </div>
    <div class="admin-card">
      ${rows.length ? `
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Services</th><th>Budget</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.name}${r.company ? `<br><span style="color:var(--muted);font-size:0.75rem;">${r.company}</span>` : ''}</td>
              <td><a href="mailto:${r.email}" style="color:var(--blue); font-size:0.85rem;">${r.email}</a></td>
              <td style="font-size:0.8rem; color:var(--muted);">${(r.services || []).join(', ')}</td>
              <td style="font-size:0.8rem; color:var(--muted);">${r.budget_range || '-'}</td>
              <td><span class="badge badge-${r.status === 'new' ? 'blue' : r.status === 'contacted' ? 'yellow' : 'green'}">${r.status}</span></td>
              <td style="color:var(--muted); font-size:0.78rem; white-space:nowrap;">${new Date(r.created_at).toLocaleDateString()}</td>
              <td>
                <form method="POST" action="/admin/quotes/status/${r.id}" style="display:flex; gap:4px;">
                  <select name="status" class="form-select" style="padding:4px 8px; font-size:0.75rem; width:auto;">
                    ${['new','contacted','quoted','won','lost'].map(s => `<option value="${s}" ${r.status===s?'selected':''}>${s}</option>`).join('')}
                  </select>
                  <button class="action-btn btn-success">Save</button>
                </form>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>` : '<div class="empty-state">No quote requests yet.</div>'}
    </div>
  `;
  res.send(layout('Quote Requests', body, 'quotes'));
});

router.post('/quotes/status/:id', express.urlencoded({ extended: false }), async (req, res) => {
  await pool.query('UPDATE quote_requests SET status=$1 WHERE id=$2', [req.body.status, req.params.id]);
  res.redirect('/admin/quotes');
});

// ============================================================
// SEO CHECKS LOG
// ============================================================
router.get('/seo-checks', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM seo_checks ORDER BY created_at DESC LIMIT 100');
  const body = `
    <div class="admin-topbar">
      <h1 class="admin-page-title">SEO Check Log</h1>
      <span style="font-size:0.82rem; color:var(--muted);">Last 100 checks</span>
    </div>
    <div class="admin-card">
      ${rows.length ? `
      <table class="admin-table">
        <thead><tr><th>URL</th><th>Perf</th><th>SEO</th><th>Access.</th><th>Best Pr.</th><th>Date</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td style="max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                <a href="${r.url}" target="_blank" style="color:var(--blue); font-size:0.82rem;">${r.url}</a>
              </td>
              <td><span style="color:${r.performance_score>=90?'#22c55e':r.performance_score>=50?'#f59e0b':'#ef4444'}; font-weight:600;">${r.performance_score}</span></td>
              <td><span style="color:${r.seo_score>=90?'#22c55e':r.seo_score>=50?'#f59e0b':'#ef4444'}; font-weight:600;">${r.seo_score}</span></td>
              <td><span style="color:${r.accessibility_score>=90?'#22c55e':r.accessibility_score>=50?'#f59e0b':'#ef4444'}; font-weight:600;">${r.accessibility_score}</span></td>
              <td><span style="color:${r.best_practices_score>=90?'#22c55e':r.best_practices_score>=50?'#f59e0b':'#ef4444'}; font-weight:600;">${r.best_practices_score}</span></td>
              <td style="color:var(--muted); font-size:0.78rem; white-space:nowrap;">${new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>` : '<div class="empty-state">No SEO checks have been run yet.</div>'}
    </div>
  `;
  res.send(layout('SEO Check Log', body, 'seo'));
});

module.exports = router;
