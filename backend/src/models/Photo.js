import db from '../config/database.js';

class Photo {
  static create(chantier_id, filename, original_name, description = '') {
    const stmt = db.prepare(`
      INSERT INTO photos (chantier_id, filename, original_name, description)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(chantier_id, filename, original_name, description);
    return result.lastInsertRowid;
  }

  static getById(id) {
    const stmt = db.prepare('SELECT * FROM photos WHERE id = ?');
    return stmt.get(id);
  }

  static getByChantier(chantierId) {
    const stmt = db.prepare('SELECT * FROM photos WHERE chantier_id = ? ORDER BY uploaded_at DESC');
    return stmt.all(chantierId);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM photos WHERE id = ?');
    return stmt.run(id);
  }

  static updateDescription(id, description) {
    const stmt = db.prepare('UPDATE photos SET description = ? WHERE id = ?');
    return stmt.run(description, id);
  }
}

export default Photo;
