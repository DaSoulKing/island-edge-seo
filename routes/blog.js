const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get all published posts
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, slug, title, excerpt, author, category, tags, published_at, created_at
       FROM blog_posts WHERE published = TRUE ORDER BY published_at DESC LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load posts.' });
  }
});

// Get single post
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM blog_posts WHERE slug = $1 AND published = TRUE`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Post not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load post.' });
  }
});

module.exports = router;
