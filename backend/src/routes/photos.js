import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Photo from '../models/Photo.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/security.js';
import {
  validatePhotoDescription,
  validateChantierIdParam,
  validateIdParam,
} from '../middleware/validators.js';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier sécurisé et unique avec crypto
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 10, // Max 10 fichiers en une fois
  },
  fileFilter: (req, file, cb) => {
    // Vérification stricte du type MIME ET de l'extension
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;

    const extname = allowedExtensions.test(file.originalname);
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (mimetype && extname) {
      // Log de l'upload pour audit
      console.log(`📤 Upload autorisé: ${file.originalname} (${file.mimetype})`);
      return cb(null, true);
    } else {
      console.warn(`⚠️  Upload refusé: ${file.originalname} (${file.mimetype}) - Type non autorisé`);
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// POST upload une photo pour un chantier (avec rate limiting)
router.post('/upload/:chantierId', uploadLimiter, validateChantierIdParam, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune photo fournie' });
    }

    const photoId = Photo.create(
      req.params.chantierId,
      req.file.filename,
      req.file.originalname,
      req.body.description || ''
    );

    const photo = Photo.getById(photoId);
    console.log(`✅ Photo uploadée: ${req.file.originalname} pour chantier ${req.params.chantierId}`);
    res.status(201).json(photo);
  } catch (error) {
    console.error('Erreur upload photo:', error);
    // Supprimer le fichier si la BDD échoue
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ error: 'Erreur lors de l\'upload de la photo' });
  }
});

// POST upload plusieurs photos (avec rate limiting)
router.post('/upload-multiple/:chantierId', uploadLimiter, validateChantierIdParam, upload.array('photos', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucune photo fournie' });
    }

    const photos = req.files.map(file => {
      const photoId = Photo.create(
        req.params.chantierId,
        file.filename,
        file.originalname,
        ''
      );
      return Photo.getById(photoId);
    });

    console.log(`✅ ${photos.length} photos uploadées pour chantier ${req.params.chantierId}`);
    res.status(201).json(photos);
  } catch (error) {
    console.error('Erreur upload multiple photos:', error);
    // Nettoyer les fichiers uploadés en cas d'erreur
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../../uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(500).json({ error: 'Erreur lors de l\'upload des photos' });
  }
});

// GET photos d'un chantier
router.get('/chantier/:chantierId', validateChantierIdParam, (req, res) => {
  try {
    const photos = Photo.getByChantier(req.params.chantierId);
    res.json(photos);
  } catch (error) {
    console.error('Erreur récupération photos:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des photos' });
  }
});

// DELETE supprimer une photo
router.delete('/:id', validateIdParam, (req, res) => {
  try {
    const photo = Photo.getById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }

    // Supprimer le fichier physique
    const filePath = path.join(__dirname, '../../uploads', photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Fichier photo supprimé: ${photo.filename}`);
    }

    Photo.delete(req.params.id);
    console.log(`✅ Photo supprimée de la BDD (ID: ${req.params.id})`);
    res.json({ message: 'Photo supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression photo:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la photo' });
  }
});

// PUT mettre à jour la description d'une photo
router.put('/:id', validateIdParam, validatePhotoDescription, (req, res) => {
  try {
    const photo = Photo.getById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }
    Photo.updateDescription(req.params.id, req.body.description);
    const updatedPhoto = Photo.getById(req.params.id);
    console.log(`✅ Description photo mise à jour (ID: ${req.params.id})`);
    res.json(updatedPhoto);
  } catch (error) {
    console.error('Erreur mise à jour photo:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la photo' });
  }
});

export default router;
