import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des routes
import authRoutes from './routes/auth.js';
import contactsRoutes from './routes/contacts.js';
import tagsRoutes from './routes/tags.js';
import chantiersRoutes from './routes/chantiers.js';
import photosRoutes from './routes/photos.js';
// Route de compatibilité (redirige vers contacts)
import clientsRoutes from './routes/clients.js';

// Import de la base de données pour initialiser les tables
import './config/database.js';

// Import du système de migrations
import { runMigrations } from './config/migrations.js';

// Import des middlewares de sécurité
import {
  helmetConfig,
  apiLimiter,
  sanitizer,
  hppProtection,
  securityLogger,
  validateJWTSecret,
} from './middleware/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Valider JWT_SECRET au démarrage
validateJWTSecret();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - Important si derrière un reverse proxy (nginx, etc.)
app.set('trust proxy', 1);

// Middlewares de sécurité
app.use(helmetConfig); // Sécurité des headers HTTP

// Configuration CORS sécurisée
const corsOptions = {
  origin: (origin, callback) => {
    // Liste des origines autorisées
    const allowedOrigins = [
      'http://localhost:3000', // Dev frontend
      'http://localhost:5173', // Vite dev server
      'http://localhost', // Production locale
      process.env.FRONTEND_URL, // Production (à définir dans .env)
    ].filter(Boolean); // Enlève les undefined

    // En développement, autoriser les requêtes sans origin (Postman, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Origine bloquée par CORS: ${origin}`);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true, // Autoriser les cookies/credentials
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Limite la taille des payloads JSON pour prévenir les attaques DoS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitization et protection
app.use(sanitizer); // Protection contre injections
app.use(hppProtection); // Protection contre HTTP Parameter Pollution
app.use(securityLogger); // Logging des activités suspectes

// Rate limiting général sur toutes les routes API
app.use('/api/', apiLimiter);

// Servir les fichiers statiques (photos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/chantiers', chantiersRoutes);
app.use('/api/photos', photosRoutes);

// Route de compatibilité (ancien endpoint /api/clients redirige vers /api/contacts)
app.use('/api/clients', clientsRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Florizar API est en ligne' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  console.warn(`❌ 404 - Route non trouvée: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();

  // Logger l'erreur avec détails
  console.error(`🚨 [ERREUR] ${timestamp}`);
  console.error(`   Route: ${req.method} ${req.originalUrl}`);
  console.error(`   IP: ${req.ip}`);
  console.error(`   Erreur: ${err.message}`);

  // En développement, logger la stack trace complète
  if (process.env.NODE_ENV !== 'production') {
    console.error(`   Stack: ${err.stack}`);
  }

  // Gestion des erreurs CORS
  if (err.message === 'Non autorisé par CORS') {
    return res.status(403).json({
      error: 'Accès non autorisé',
      message: 'Origine non autorisée par la politique CORS'
    });
  }

  // Gestion des erreurs Multer (upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Fichier trop volumineux',
        message: 'La taille maximale autorisée est de 10MB'
      });
    }
    return res.status(400).json({
      error: 'Erreur d\'upload',
      message: err.message
    });
  }

  // Gestion des erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      message: err.message
    });
  }

  // Erreur générique (ne pas révéler les détails en production)
  const errorResponse = {
    error: 'Erreur serveur interne',
  };

  // En développement, inclure plus de détails
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.message = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
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
