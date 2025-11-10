const pool = require('../config/database');

class Page {
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM pages ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM pages WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const result = await pool.query(
      'SELECT * FROM pages WHERE slug = $1',
      [slug]
    );
    return result.rows[0];
  }

  static async create(title, slug, content, metaDescription) {
    const result = await pool.query(
      'INSERT INTO pages (title, slug, content, meta_description) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, slug, content, metaDescription]
    );
    return result.rows[0];
  }

  static async update(id, title, slug, content, metaDescription, isPublished) {
    const result = await pool.query(
      'UPDATE pages SET title = $1, slug = $2, content = $3, meta_description = $4, is_published = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [title, slug, content, metaDescription, isPublished, id]
    );
    return result.rows[0];
  }

  static async updateContent(id, content) {
    const result = await pool.query(
      'UPDATE pages SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [content, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM pages WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Page;
