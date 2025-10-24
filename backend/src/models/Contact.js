import db from '../config/database.js';

/**
 * Modèle Contact
 * Gère les contacts (personnes physiques et morales)
 * Remplace l'ancien modèle Client avec fonctionnalités étendues
 */
class Contact {
  /**
   * Récupérer tous les contacts avec leurs tags
   * @param {Object} filters - Filtres optionnels {actif, type_personne, tags}
   */
  static getAll(filters = {}) {
    let query = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];

    // Filtre par statut actif/inactif
    if (filters.actif !== undefined) {
      query += ' AND actif = ?';
      params.push(filters.actif ? 1 : 0);
    }

    // Filtre par type de personne
    if (filters.type_personne) {
      query += ' AND type_personne = ?';
      params.push(filters.type_personne);
    }

    query += ' ORDER BY nom ASC, prenom ASC';

    const stmt = db.prepare(query);
    const contacts = stmt.all(...params);

    // Ajouter les tags pour chaque contact
    return contacts.map(contact => ({
      ...contact,
      tags: this.getTags(contact.id),
      relations: this.getRelations(contact.id)
    }));
  }

  /**
   * Récupérer un contact par ID avec ses tags et relations
   */
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
    const contact = stmt.get(id);

    if (!contact) return null;

    // Ajouter les tags et relations
    return {
      ...contact,
      tags: this.getTags(id),
      relations: this.getRelations(id),
      interlocuteurs: this.getInterlocuteurs(id)
    };
  }

  /**
   * Créer un nouveau contact
   */
  static create(contactData) {
    const {
      type_personne = 'physique',
      nom,
      prenom,
      raison_sociale,
      email,
      telephone,
      telephone_secondaire,
      adresse,
      ville,
      code_postal,
      pays = 'France',
      siret,
      tva_intracommunautaire,
      forme_juridique,
      actif = 1,
      notes
    } = contactData;

    const stmt = db.prepare(`
      INSERT INTO contacts (
        type_personne, nom, prenom, raison_sociale, email, telephone, telephone_secondaire,
        adresse, ville, code_postal, pays, siret, tva_intracommunautaire,
        forme_juridique, actif, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      type_personne, nom, prenom, raison_sociale, email, telephone, telephone_secondaire,
      adresse, ville, code_postal, pays, siret, tva_intracommunautaire,
      forme_juridique, actif, notes
    );

    return result.lastInsertRowid;
  }

  /**
   * Mettre à jour un contact
   */
  static update(id, contactData) {
    const {
      type_personne,
      nom,
      prenom,
      raison_sociale,
      email,
      telephone,
      telephone_secondaire,
      adresse,
      ville,
      code_postal,
      pays,
      siret,
      tva_intracommunautaire,
      forme_juridique,
      actif,
      notes
    } = contactData;

    const stmt = db.prepare(`
      UPDATE contacts
      SET type_personne = ?, nom = ?, prenom = ?, raison_sociale = ?, email = ?,
          telephone = ?, telephone_secondaire = ?, adresse = ?, ville = ?,
          code_postal = ?, pays = ?, siret = ?, tva_intracommunautaire = ?,
          forme_juridique = ?, actif = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    return stmt.run(
      type_personne, nom, prenom, raison_sociale, email, telephone, telephone_secondaire,
      adresse, ville, code_postal, pays, siret, tva_intracommunautaire,
      forme_juridique, actif, notes, id
    );
  }

  /**
   * Supprimer un contact (et toutes ses relations)
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    return stmt.run(id);
  }

  /**
   * Basculer le statut actif/inactif d'un contact
   */
  static toggleActif(id) {
    const stmt = db.prepare(`
      UPDATE contacts
      SET actif = CASE WHEN actif = 1 THEN 0 ELSE 1 END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(id);
  }

  /**
   * Rechercher des contacts par nom, prénom, raison sociale ou email
   */
  static search(searchTerm, filters = {}) {
    let query = `
      SELECT * FROM contacts
      WHERE (nom LIKE ? OR prenom LIKE ? OR raison_sociale LIKE ? OR email LIKE ?)
    `;
    const params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    if (filters.actif !== undefined) {
      query += ' AND actif = ?';
      params.push(filters.actif ? 1 : 0);
    }

    if (filters.type_personne) {
      query += ' AND type_personne = ?';
      params.push(filters.type_personne);
    }

    query += ' ORDER BY nom ASC, prenom ASC LIMIT 50';

    const stmt = db.prepare(query);
    const contacts = stmt.all(...params);

    return contacts.map(contact => ({
      ...contact,
      tags: this.getTags(contact.id)
    }));
  }

  /**
   * Récupérer les tags d'un contact
   */
  static getTags(contactId) {
    const stmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN contact_tags ct ON t.id = ct.tag_id
      WHERE ct.contact_id = ?
      ORDER BY t.nom
    `);
    return stmt.all(contactId);
  }

  /**
   * Ajouter un tag à un contact
   */
  static addTag(contactId, tagId) {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO contact_tags (contact_id, tag_id)
      VALUES (?, ?)
    `);
    return stmt.run(contactId, tagId);
  }

  /**
   * Retirer un tag d'un contact
   */
  static removeTag(contactId, tagId) {
    const stmt = db.prepare(`
      DELETE FROM contact_tags
      WHERE contact_id = ? AND tag_id = ?
    `);
    return stmt.run(contactId, tagId);
  }

  /**
   * Récupérer toutes les relations d'un contact
   */
  static getRelations(contactId) {
    const stmt = db.prepare(`
      SELECT cr.*, c.nom, c.prenom, c.raison_sociale, c.type_personne
      FROM contact_relations cr
      INNER JOIN contacts c ON cr.contact_lie_id = c.id
      WHERE cr.contact_id = ?
      ORDER BY cr.type_relation, c.nom
    `);
    return stmt.all(contactId);
  }

  /**
   * Récupérer les interlocuteurs d'une entreprise
   */
  static getInterlocuteurs(contactId) {
    const stmt = db.prepare(`
      SELECT cr.*, c.*
      FROM contact_relations cr
      INNER JOIN contacts c ON cr.contact_lie_id = c.id
      WHERE cr.contact_id = ? AND cr.type_relation = 'interlocuteur'
      ORDER BY c.nom, c.prenom
    `);
    return stmt.all(contactId);
  }

  /**
   * Ajouter une relation entre deux contacts
   */
  static addRelation(contactId, contactLieId, typeRelation, fonction = null, notes = null) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO contact_relations (contact_id, contact_lie_id, type_relation, fonction, notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(contactId, contactLieId, typeRelation, fonction, notes);
  }

  /**
   * Supprimer une relation
   */
  static removeRelation(relationId) {
    const stmt = db.prepare('DELETE FROM contact_relations WHERE id = ?');
    return stmt.run(relationId);
  }

  /**
   * Récupérer les contacts par tag
   */
  static getByTag(tagId, filters = {}) {
    let query = `
      SELECT c.* FROM contacts c
      INNER JOIN contact_tags ct ON c.id = ct.contact_id
      WHERE ct.tag_id = ?
    `;
    const params = [tagId];

    if (filters.actif !== undefined) {
      query += ' AND c.actif = ?';
      params.push(filters.actif ? 1 : 0);
    }

    query += ' ORDER BY c.nom ASC, c.prenom ASC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Obtenir des statistiques sur les contacts
   */
  static getStats() {
    const stats = {};

    // Total contacts
    stats.total = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;

    // Contacts actifs/inactifs
    stats.actifs = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE actif = 1').get().count;
    stats.inactifs = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE actif = 0').get().count;

    // Par type de personne
    stats.physiques = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE type_personne = "physique"').get().count;
    stats.morales = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE type_personne = "morale"').get().count;

    // Par tag
    const tagStats = db.prepare(`
      SELECT t.nom, t.couleur, COUNT(ct.contact_id) as count
      FROM tags t
      LEFT JOIN contact_tags ct ON t.id = ct.tag_id
      GROUP BY t.id
      ORDER BY count DESC
    `).all();
    stats.parTag = tagStats;

    return stats;
  }
}

export default Contact;
