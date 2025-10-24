import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Photo from '../models/Photo.js';
import { authenticateToken } from '../middleware/auth.js';
import fs from 'fs';

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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// POST upload une photo pour un chantier
router.post('/upload/:chantierId', upload.single('photo'), (req, res) => {
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
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'upload de la photo' });
  }
});

// POST upload plusieurs photos
router.post('/upload-multiple/:chantierId', upload.array('photos', 10), (req, res) => {
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

    res.status(201).json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'upload des photos' });
  }
});

// GET photos d'un chantier
router.get('/chantier/:chantierId', (req, res) => {
  try {
    const photos = Photo.getByChantier(req.params.chantierId);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des photos' });
  }
});

// DELETE supprimer une photo
router.delete('/:id', (req, res) => {
  try {
    const photo = Photo.getById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' });
    }

    // Supprimer le fichier physique
    const filePath = path.join(__dirname, '../../uploads', photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    Photo.delete(req.params.id);
    res.json({ message: 'Photo supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la photo' });
  }
});

// PUT mettre à jour la description d'une photo
router.put('/:id', (req, res) => {
  try {
    Photo.updateDescription(req.params.id, req.body.description);
    const photo = Photo.getById(req.params.id);
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la photo' });
  }
});

export default router;
