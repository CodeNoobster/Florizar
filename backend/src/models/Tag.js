import db from '../config/database.js';

/**
 * Modèle Tag
 * Gère les tags pour catégoriser les contacts
 */
class Tag {
  /**
   * Récupérer tous les tags
   */
  static getAll() {
    const stmt = db.prepare('SELECT * FROM tags ORDER BY nom ASC');
    const tags = stmt.all();

    // Ajouter le nombre de contacts pour chaque tag
    return tags.map(tag => ({
      ...tag,
      contactCount: this.getContactCount(tag.id)
    }));
  }

  /**
   * Récupérer un tag par ID
   */
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM tags WHERE id = ?');
    const tag = stmt.get(id);

    if (!tag) return null;

    return {
      ...tag,
      contactCount: this.getContactCount(id)
    };
  }

  /**
   * Récupérer un tag par nom
   */
  static getByNom(nom) {
    const stmt = db.prepare('SELECT * FROM tags WHERE nom = ?');
    return stmt.get(nom);
  }

  /**
   * Créer un nouveau tag
   */
  static create(tagData) {
    const { nom, couleur = '#6b7280', description = '' } = tagData;

    const stmt = db.prepare(`
      INSERT INTO tags (nom, couleur, description)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(nom, couleur, description);
    return result.lastInsertRowid;
  }

  /**
   * Mettre à jour un tag
   */
  static update(id, tagData) {
    const { nom, couleur, description } = tagData;

    const stmt = db.prepare(`
      UPDATE tags
      SET nom = ?, couleur = ?, description = ?
      WHERE id = ?
    `);

    return stmt.run(nom, couleur, description, id);
  }

  /**
   * Supprimer un tag
   * Les associations contact_tags seront supprimées en cascade
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM tags WHERE id = ?');
    return stmt.run(id);
  }

  /**
   * Compter le nombre de contacts ayant ce tag
   */
  static getContactCount(tagId) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM contact_tags
      WHERE tag_id = ?
    `);
    return stmt.get(tagId).count;
  }

  /**
   * Rechercher des tags par nom
   */
  static search(searchTerm) {
    const stmt = db.prepare(`
      SELECT * FROM tags
      WHERE nom LIKE ? OR description LIKE ?
      ORDER BY nom ASC
    `);
    const term = `%${searchTerm}%`;
    return stmt.all(term, term);
  }

  /**
   * Obtenir tous les tags avec leur nombre d'utilisations
   */
  static getAllWithCount() {
    const stmt = db.prepare(`
      SELECT t.*, COUNT(ct.contact_id) as contact_count
      FROM tags t
      LEFT JOIN contact_tags ct ON t.id = ct.tag_id
      GROUP BY t.id
      ORDER BY t.nom ASC
    `);
    return stmt.all();
  }

  /**
   * Obtenir les tags les plus utilisés
   */
  static getTopUsed(limit = 10) {
    const stmt = db.prepare(`
      SELECT t.*, COUNT(ct.contact_id) as contact_count
      FROM tags t
      LEFT JOIN contact_tags ct ON t.id = ct.tag_id
      GROUP BY t.id
      ORDER BY contact_count DESC
      LIMIT ?
    `);
    return stmt.all(limit);
  }
}

export default Tag;
