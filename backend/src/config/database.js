import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../database.sqlite'));

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

// Créer les tables
const createTables = () => {
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      actif INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des clients - Structure extensible
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT,
      entreprise TEXT,
      telephone TEXT,
      telephone_secondaire TEXT,
      email TEXT,
      adresse TEXT,
      ville TEXT,
      code_postal TEXT,
      pays TEXT DEFAULT 'France',
      type_client TEXT DEFAULT 'particulier',
      notes TEXT,
      actif INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des chantiers - Relation 1-N avec clients
  db.exec(`
    CREATE TABLE IF NOT EXISTS chantiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      titre TEXT NOT NULL,
      description TEXT,
      date_debut DATE NOT NULL,
      date_fin DATE,
      date_prevue_fin DATE,
      statut TEXT DEFAULT 'en_cours',
      priorite TEXT DEFAULT 'normale',
      superficie REAL,
      budget_estime REAL,
      cout_reel REAL,
      resume_travaux TEXT,
      notes_prochaine_fois TEXT,
      localisation_precise TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);

  // Table des photos
  db.exec(`
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chantier_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      description TEXT,
      type TEXT DEFAULT 'chantier',
      ordre INTEGER DEFAULT 0,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chantier_id) REFERENCES chantiers(id) ON DELETE CASCADE
    )
  `);

  // Table des interventions (pour suivi détaillé)
  db.exec(`
    CREATE TABLE IF NOT EXISTS interventions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chantier_id INTEGER NOT NULL,
      date_intervention DATE NOT NULL,
      heure_debut TIME,
      heure_fin TIME,
      duree_heures REAL,
      description TEXT,
      travaux_effectues TEXT,
      materiaux_utilises TEXT,
      nombre_ouvriers INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chantier_id) REFERENCES chantiers(id) ON DELETE CASCADE
    )
  `);

  // Table des devis (future fonctionnalité)
  db.exec(`
    CREATE TABLE IF NOT EXISTS devis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      numero_devis TEXT UNIQUE,
      date_creation DATE NOT NULL,
      date_validite DATE,
      statut TEXT DEFAULT 'en_attente',
      montant_ht REAL,
      montant_tva REAL,
      montant_ttc REAL,
      description TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);

  // Table des lignes de devis
  db.exec(`
    CREATE TABLE IF NOT EXISTS devis_lignes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      devis_id INTEGER NOT NULL,
      designation TEXT NOT NULL,
      quantite REAL DEFAULT 1,
      unite TEXT DEFAULT 'unité',
      prix_unitaire REAL NOT NULL,
      montant REAL NOT NULL,
      ordre INTEGER DEFAULT 0,
      FOREIGN KEY (devis_id) REFERENCES devis(id) ON DELETE CASCADE
    )
  `);

  // Table des factures (future fonctionnalité)
  db.exec(`
    CREATE TABLE IF NOT EXISTS factures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      chantier_id INTEGER,
      devis_id INTEGER,
      numero_facture TEXT UNIQUE,
      date_emission DATE NOT NULL,
      date_echeance DATE,
      statut TEXT DEFAULT 'non_payee',
      montant_ht REAL,
      montant_tva REAL,
      montant_ttc REAL,
      montant_paye REAL DEFAULT 0,
      mode_paiement TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      FOREIGN KEY (chantier_id) REFERENCES chantiers(id) ON DELETE SET NULL,
      FOREIGN KEY (devis_id) REFERENCES devis(id) ON DELETE SET NULL
    )
  `);

  // Table des équipements/matériels (future fonctionnalité)
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      categorie TEXT,
      marque TEXT,
      modele TEXT,
      numero_serie TEXT,
      date_achat DATE,
      prix_achat REAL,
      statut TEXT DEFAULT 'disponible',
      derniere_maintenance DATE,
      prochaine_maintenance DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table de liaison chantiers-équipements
  db.exec(`
    CREATE TABLE IF NOT EXISTS chantiers_equipements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chantier_id INTEGER NOT NULL,
      equipement_id INTEGER NOT NULL,
      date_utilisation DATE,
      notes TEXT,
      FOREIGN KEY (chantier_id) REFERENCES chantiers(id) ON DELETE CASCADE,
      FOREIGN KEY (equipement_id) REFERENCES equipements(id) ON DELETE CASCADE
    )
  `);

  // Index pour optimiser les requêtes
  db.exec(`CREATE INDEX IF NOT EXISTS idx_chantiers_client ON chantiers(client_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_chantiers_statut ON chantiers(statut)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_photos_chantier ON photos(chantier_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_interventions_chantier ON interventions(chantier_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_devis_client ON devis(client_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_factures_client ON factures(client_id)`);

  console.log('✅ Base de données créée avec succès - Structure évolutive prête');
};

createTables();

export default db;
