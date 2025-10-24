import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Système de migration de base de données
 * Permet d'évoluer le schéma sans perdre les données
 */

// Créer la table des migrations si elle n'existe pas
const initMigrationsTable = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER UNIQUE NOT NULL,
      name TEXT NOT NULL,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Obtenir la version actuelle de la BDD
const getCurrentVersion = () => {
  try {
    const result = db.prepare('SELECT MAX(version) as version FROM migrations').get();
    return result.version || 0;
  } catch (error) {
    return 0;
  }
};

// Liste des migrations (à étendre au fil du temps)
const migrations = [
  {
    version: 1,
    name: 'initial_schema',
    up: () => {
      // Migration initiale déjà effectuée dans database.js
      console.log('✅ Migration v1: Schéma initial (déjà appliqué)');
    }
  },
  {
    version: 2,
    name: 'refonte_systeme_contacts',
    up: () => {
      console.log('🔄 Migration v2: Refonte complète du système clients → contacts');

      // ÉTAPE 1: Créer la nouvelle table contacts avec tous les champs
      db.exec(`
        CREATE TABLE IF NOT EXISTS contacts_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,

          -- Type de personne
          type_personne TEXT NOT NULL DEFAULT 'physique', -- 'physique' ou 'morale'

          -- Informations générales (personnes physiques et morales)
          nom TEXT NOT NULL,
          prenom TEXT,
          raison_sociale TEXT, -- Pour les entreprises

          -- Contact
          email TEXT,
          telephone TEXT,
          telephone_secondaire TEXT,

          -- Adresse
          adresse TEXT,
          ville TEXT,
          code_postal TEXT,
          pays TEXT DEFAULT 'France',

          -- Informations entreprise (si type_personne = 'morale')
          siret TEXT,
          tva_intracommunautaire TEXT,
          forme_juridique TEXT, -- SARL, SAS, SA, etc.

          -- Statut
          actif INTEGER DEFAULT 1, -- 1 = actif, 0 = inactif

          -- Notes
          notes TEXT,

          -- Métadonnées
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('  ✓ Table contacts_new créée');

      // ÉTAPE 2: Migrer les données existantes de clients vers contacts_new
      db.exec(`
        INSERT INTO contacts_new (
          id, type_personne, nom, prenom, email, telephone, adresse,
          ville, code_postal, pays, actif, notes, created_at, updated_at
        )
        SELECT
          id,
          'physique' as type_personne,
          nom,
          prenom,
          email,
          telephone,
          adresse,
          ville,
          code_postal,
          COALESCE(pays, 'France') as pays,
          1 as actif,
          notes,
          created_at,
          created_at as updated_at
        FROM clients
      `);

      console.log('  ✓ Données migrées de clients vers contacts_new');

      // ÉTAPE 3: Supprimer l'ancienne table clients et renommer
      db.exec(`DROP TABLE IF EXISTS clients`);
      db.exec(`ALTER TABLE contacts_new RENAME TO contacts`);

      console.log('  ✓ Table clients renommée en contacts');

      // ÉTAPE 4: Créer la table des tags
      db.exec(`
        CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nom TEXT UNIQUE NOT NULL,
          couleur TEXT, -- Code couleur hex pour l'affichage
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('  ✓ Table tags créée');

      // ÉTAPE 5: Créer la table de liaison contact_tags (many-to-many)
      db.exec(`
        CREATE TABLE IF NOT EXISTS contact_tags (
          contact_id INTEGER NOT NULL,
          tag_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (contact_id, tag_id),
          FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        )
      `);

      console.log('  ✓ Table contact_tags créée');

      // ÉTAPE 6: Créer la table des relations entre contacts
      db.exec(`
        CREATE TABLE IF NOT EXISTS contact_relations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contact_id INTEGER NOT NULL, -- Contact source
          contact_lie_id INTEGER NOT NULL, -- Contact lié
          type_relation TEXT NOT NULL, -- 'interlocuteur', 'associe', 'famille', etc.
          fonction TEXT, -- Fonction de l'interlocuteur (ex: "Directeur Commercial")
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
          FOREIGN KEY (contact_lie_id) REFERENCES contacts(id) ON DELETE CASCADE,
          UNIQUE(contact_id, contact_lie_id, type_relation)
        )
      `);

      console.log('  ✓ Table contact_relations créée');

      // ÉTAPE 7: Créer les index pour les performances
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_contacts_type_personne ON contacts(type_personne);
        CREATE INDEX IF NOT EXISTS idx_contacts_actif ON contacts(actif);
        CREATE INDEX IF NOT EXISTS idx_contacts_nom ON contacts(nom);
        CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
        CREATE INDEX IF NOT EXISTS idx_contact_tags_contact ON contact_tags(contact_id);
        CREATE INDEX IF NOT EXISTS idx_contact_tags_tag ON contact_tags(tag_id);
        CREATE INDEX IF NOT EXISTS idx_contact_relations_contact ON contact_relations(contact_id);
        CREATE INDEX IF NOT EXISTS idx_contact_relations_lie ON contact_relations(contact_lie_id);
      `);

      console.log('  ✓ Index créés');

      // ÉTAPE 8: Insérer des tags par défaut
      db.exec(`
        INSERT OR IGNORE INTO tags (nom, couleur, description) VALUES
        ('Client', '#22c55e', 'Contact client actif'),
        ('Prospect', '#3b82f6', 'Prospect potentiel'),
        ('Fournisseur', '#f59e0b', 'Fournisseur de services ou produits'),
        ('Partenaire', '#8b5cf6', 'Partenaire commercial'),
        ('Ancien client', '#6b7280', 'Ancien client inactif')
      `);

      console.log('  ✓ Tags par défaut créés');

      // ÉTAPE 9: Assigner automatiquement le tag "Client" aux contacts migrés
      const tagClient = db.prepare('SELECT id FROM tags WHERE nom = ?').get('Client');
      if (tagClient) {
        db.exec(`
          INSERT OR IGNORE INTO contact_tags (contact_id, tag_id)
          SELECT id, ${tagClient.id} FROM contacts
        `);
        console.log('  ✓ Tag "Client" assigné aux contacts migrés');
      }

      // ÉTAPE 10: Mettre à jour la table chantiers pour référencer contacts
      db.exec(`
        CREATE TABLE IF NOT EXISTS chantiers_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nom TEXT NOT NULL,
          contact_id INTEGER NOT NULL,
          adresse TEXT,
          ville TEXT,
          code_postal TEXT,
          date_debut DATE,
          date_fin DATE,
          statut TEXT DEFAULT 'planifie',
          description TEXT,
          travaux_realises TEXT,
          travaux_a_faire TEXT,
          budget_estime REAL,
          cout_reel REAL,
          superficie REAL,
          priorite TEXT DEFAULT 'moyenne',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
        )
      `);

      // Copier les données en renommant client_id en contact_id
      db.exec(`
        INSERT INTO chantiers_new
        SELECT * FROM chantiers
      `);

      db.exec(`DROP TABLE IF EXISTS chantiers`);
      db.exec(`ALTER TABLE chantiers_new RENAME TO chantiers`);
      db.exec(`CREATE INDEX IF NOT EXISTS idx_chantiers_contact ON chantiers(contact_id)`);

      console.log('  ✓ Table chantiers mise à jour (client_id → contact_id)');

      console.log('✅ Migration v2 terminée: Système de contacts opérationnel');
    }
  },
];

// Exécuter les migrations en attente
export const runMigrations = () => {
  initMigrationsTable();

  const currentVersion = getCurrentVersion();
  console.log(`📊 Version actuelle de la BDD: v${currentVersion}`);

  const pendingMigrations = migrations.filter(m => m.version > currentVersion);

  if (pendingMigrations.length === 0) {
    console.log('✅ Base de données à jour (aucune migration en attente)');
    return;
  }

  console.log(`🔄 ${pendingMigrations.length} migration(s) en attente...`);

  // Créer une sauvegarde avant migration
  const backupPath = path.join(__dirname, '../../', `database_backup_v${currentVersion}.sqlite`);
  try {
    if (fs.existsSync(path.join(__dirname, '../../database.sqlite'))) {
      fs.copyFileSync(
        path.join(__dirname, '../../database.sqlite'),
        backupPath
      );
      console.log(`💾 Sauvegarde créée: ${backupPath}`);
    }
  } catch (error) {
    console.warn('⚠️  Impossible de créer une sauvegarde:', error.message);
  }

  // Exécuter les migrations dans une transaction
  try {
    db.exec('BEGIN TRANSACTION');

    for (const migration of pendingMigrations) {
      console.log(`🔄 Application de la migration v${migration.version}: ${migration.name}`);

      // Exécuter la migration
      migration.up();

      // Enregistrer la migration
      db.prepare('INSERT INTO migrations (version, name) VALUES (?, ?)').run(
        migration.version,
        migration.name
      );
    }

    db.exec('COMMIT');
    console.log('✅ Toutes les migrations ont été appliquées avec succès');

    // Supprimer la sauvegarde si tout s'est bien passé
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('❌ Erreur lors de la migration:', error);
    console.log(`💾 Restauration depuis: ${backupPath}`);

    // Restaurer la sauvegarde
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(
        backupPath,
        path.join(__dirname, '../../database.sqlite')
      );
      console.log('✅ Base de données restaurée');
    }

    throw error;
  }
};

// Créer une nouvelle migration (helper pour les développeurs)
export const createMigration = (name) => {
  const version = Math.max(...migrations.map(m => m.version), 0) + 1;

  const template = `
{
  version: ${version},
  name: '${name}',
  up: () => {
    db.exec(\`
      -- Votre SQL ici
      -- Exemple: ALTER TABLE clients ADD COLUMN nouvelle_colonne TEXT;
    \`);
    console.log('✅ Migration v${version}: ${name}');
  }
},
`;

  console.log('\n📝 Nouvelle migration à ajouter dans migrations.js:\n');
  console.log(template);
};

export default { runMigrations, createMigration };
