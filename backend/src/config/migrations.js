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
  // Exemple de migration future :
  // {
  //   version: 2,
  //   name: 'add_client_siret',
  //   up: () => {
  //     db.exec(`
  //       ALTER TABLE clients ADD COLUMN siret TEXT;
  //     `);
  //     console.log('✅ Migration v2: Ajout du SIRET client');
  //   }
  // },
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
