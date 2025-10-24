import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des routes
import authRoutes from './routes/auth.js';
import clientsRoutes from './routes/clients.js';
import chantiersRoutes from './routes/chantiers.js';
import photosRoutes from './routes/photos.js';

// Import de la base de données pour initialiser les tables
import './config/database.js';

// Import du système de migrations
import { runMigrations } from './config/migrations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (photos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/chantiers', chantiersRoutes);
app.use('/api/photos', photosRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Florizar API est en ligne' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Exécuter les migrations avant de démarrer le serveur
try {
  runMigrations();
} catch (error) {
  console.error('❌ Erreur lors des migrations:', error);
  console.error('⚠️  Le serveur ne démarrera pas. Vérifiez votre base de données.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Serveur Florizar démarré sur le port ${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
  console.log(`🖼️  Photos accessibles sur http://localhost:${PORT}/uploads`);
  console.log(`💾 Base de données: ./database.sqlite`);
});
