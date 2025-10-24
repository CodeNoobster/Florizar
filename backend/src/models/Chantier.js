import db from '../config/database.js';

/**
 * Modèle Chantier
 * Gère les chantiers liés aux contacts
 */
class Chantier {
  static getAll() {
    const stmt = db.prepare(`
      SELECT
        ch.*,
        c.nom as contact_nom,
        c.prenom as contact_prenom,
        c.raison_sociale as contact_raison_sociale,
        c.type_personne as contact_type_personne
      FROM chantiers ch
      LEFT JOIN contacts c ON ch.contact_id = c.id
      ORDER BY ch.date_debut DESC
    `);
    return stmt.all();
  }

  static getById(id) {
    const stmt = db.prepare(`
      SELECT
        ch.*,
        c.nom as contact_nom,
        c.prenom as contact_prenom,
        c.raison_sociale as contact_raison_sociale,
        c.type_personne as contact_type_personne,
        c.email as contact_email,
        c.telephone as contact_telephone
      FROM chantiers ch
      LEFT JOIN contacts c ON ch.contact_id = c.id
      WHERE ch.id = ?
    `);
    return stmt.get(id);
  }

  /**
   * Récupérer tous les chantiers d'un contact
   * Supporte à la fois contact_id et l'ancien client_id pour rétrocompatibilité
   */
  static getByContactId(contactId) {
    const stmt = db.prepare('SELECT * FROM chantiers WHERE contact_id = ? ORDER BY date_debut DESC');
    return stmt.all(contactId);
  }

  // Alias pour rétrocompatibilité
  static getByClientId(clientId) {
    return this.getByContactId(clientId);
  }

  static create(chantierData) {
    const {
      contact_id,
      client_id, // Pour rétrocompatibilité
      nom,
      titre, // Pour rétrocompatibilité
      adresse,
      ville,
      code_postal,
      date_debut,
      date_fin,
      statut = 'planifie',
      description,
      travaux_realises,
      travaux_a_faire,
      budget_estime,
      cout_reel,
      superficie,
      priorite = 'moyenne'
    } = chantierData;

    // Utiliser contact_id ou client_id (rétrocompatibilité)
    const finalContactId = contact_id || client_id;
    const finalNom = nom || titre;

    const stmt = db.prepare(`
      INSERT INTO chantiers (
        contact_id, nom, adresse, ville, code_postal, date_debut, date_fin,
        statut, description, travaux_realises, travaux_a_faire,
        budget_estime, cout_reel, superficie, priorite
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      finalContactId, finalNom, adresse, ville, code_postal,
      date_debut, date_fin || null, statut, description,
      travaux_realises, travaux_a_faire, budget_estime, cout_reel,
      superficie, priorite
    );
    return result.lastInsertRowid;
  }

  static update(id, chantierData) {
    const {
      contact_id,
      client_id, // Pour rétrocompatibilité
      nom,
      titre, // Pour rétrocompatibilité
      adresse,
      ville,
      code_postal,
      date_debut,
      date_fin,
      statut,
      description,
      travaux_realises,
      travaux_a_faire,
      budget_estime,
      cout_reel,
      superficie,
      priorite
    } = chantierData;

    const finalContactId = contact_id || client_id;
    const finalNom = nom || titre;

    const stmt = db.prepare(`
      UPDATE chantiers
      SET contact_id = ?, nom = ?, adresse = ?, ville = ?, code_postal = ?,
          date_debut = ?, date_fin = ?, statut = ?, description = ?,
          travaux_realises = ?, travaux_a_faire = ?, budget_estime = ?,
          cout_reel = ?, superficie = ?, priorite = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    return stmt.run(
      finalContactId, finalNom, adresse, ville, code_postal,
      date_debut, date_fin || null, statut, description,
      travaux_realises, travaux_a_faire, budget_estime, cout_reel,
      superficie, priorite, id
    );
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
