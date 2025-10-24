import db from '../config/database.js';

class Chantier {
  static getAll() {
    const stmt = db.prepare(`
      SELECT c.*, cl.nom as client_nom, cl.prenom as client_prenom, cl.entreprise as client_entreprise
      FROM chantiers c
      LEFT JOIN clients cl ON c.client_id = cl.id
      ORDER BY c.date_debut DESC
    `);
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare(`
      SELECT c.*, cl.nom as client_nom, cl.prenom as client_prenom, cl.entreprise as client_entreprise
      FROM chantiers c
      LEFT JOIN clients cl ON c.client_id = cl.id
      WHERE c.id = ?
    `);
    return stmt.get(id);
  }

  static getByClientId(clientId) {
    const stmt = db.prepare('SELECT * FROM chantiers WHERE client_id = ? ORDER BY date_debut DESC');
    return stmt.all(clientId);
  }

  static create(chantierData) {
    const { client_id, titre, date_debut, date_fin, statut, resume_travaux, notes_prochaine_fois } = chantierData;
    const stmt = db.prepare(`
      INSERT INTO chantiers (client_id, titre, date_debut, date_fin, statut, resume_travaux, notes_prochaine_fois)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(client_id, titre, date_debut, date_fin || null, statut || 'en_cours', resume_travaux, notes_prochaine_fois);
    return result.lastInsertRowid;
  }

  static update(id, chantierData) {
    const { client_id, titre, date_debut, date_fin, statut, resume_travaux, notes_prochaine_fois } = chantierData;
    const stmt = db.prepare(`
      UPDATE chantiers
      SET client_id = ?, titre = ?, date_debut = ?, date_fin = ?, statut = ?,
          resume_travaux = ?, notes_prochaine_fois = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(client_id, titre, date_debut, date_fin || null, statut, resume_travaux, notes_prochaine_fois, id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM chantiers WHERE id = ?');
    return stmt.run(id);
  }

  static getPhotos(chantierId) {
    const stmt = db.prepare('SELECT * FROM photos WHERE chantier_id = ? ORDER BY uploaded_at DESC');
    return stmt.all(chantierId);
  }
}

export default Chantier;
