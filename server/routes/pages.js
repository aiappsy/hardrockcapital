const express = require('express');
const Page = require('../models/Page');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all pages (public)
router.get('/', async (req, res) => {
  try {
    const pages = await Page.findAll();
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Get single page by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Get page by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const page = await Page.findBySlug(req.params.slug);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Create new page (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, slug, content, metaDescription } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const page = await Page.create(title, slug, content || '', metaDescription || '');
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'A page with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// Update page (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, slug, content, metaDescription, isPublished } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const page = await Page.update(
      req.params.id,
      title,
      slug,
      content || '',
      metaDescription || '',
      isPublished !== undefined ? isPublished : true
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'A page with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Update page content only (protected)
router.put('/:id/content', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const page = await Page.updateContent(req.params.id, content);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({ error: 'Failed to update page content' });
  }
});

// Delete page (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const page = await Page.delete(req.params.id);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

module.exports = router;
