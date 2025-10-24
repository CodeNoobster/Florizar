import db from '../config/database.js';

class Client {
  static getAll() {
    const stmt = db.prepare('SELECT * FROM clients ORDER BY created_at DESC');
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare('SELECT * FROM clients WHERE id = ?');
    return stmt.get(id);
  }

  static create(clientData) {
    const { nom, prenom, entreprise, telephone, email, adresse, ville, code_postal, notes } = clientData;
    const stmt = db.prepare(`
      INSERT INTO clients (nom, prenom, entreprise, telephone, email, adresse, ville, code_postal, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(nom, prenom, entreprise, telephone, email, adresse, ville, code_postal, notes);
    return result.lastInsertRowid;
  }

  static update(id, clientData) {
    const { nom, prenom, entreprise, telephone, email, adresse, ville, code_postal, notes } = clientData;
    const stmt = db.prepare(`
      UPDATE clients
      SET nom = ?, prenom = ?, entreprise = ?, telephone = ?, email = ?,
          adresse = ?, ville = ?, code_postal = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(nom, prenom, entreprise, telephone, email, adresse, ville, code_postal, notes, id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM clients WHERE id = ?');
    return stmt.run(id);
  }

  static searchByName(searchTerm) {
    const stmt = db.prepare(`
      SELECT * FROM clients
      WHERE nom LIKE ? OR prenom LIKE ? OR entreprise LIKE ?
      ORDER BY created_at DESC
    `);
    const term = `%${searchTerm}%`;
    return stmt.all(term, term, term);
  }
}

export default Client;
