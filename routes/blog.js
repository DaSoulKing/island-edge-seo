const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get playbook posts only
router.get('/playbook', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, slug, title, excerpt, author, category, tags, published_at, created_at
       FROM blog_posts WHERE published = TRUE AND is_playbook = TRUE ORDER BY published_at ASC LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load playbook posts.' });
  }
});

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

// Get playbook posts only
router.get('/playbook/list', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, slug, title, excerpt, author, category, playbook_part, published_at, created_at
       FROM blog_posts WHERE published = TRUE AND is_playbook = TRUE
       ORDER BY playbook_part ASC NULLS LAST, published_at ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load playbook posts.' });
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
