import express from 'express';
import Chantier from '../models/Chantier.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// GET tous les chantiers
router.get('/', (req, res) => {
  try {
    const chantiers = Chantier.getAll();
    res.json(chantiers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des chantiers' });
  }
});

// GET un chantier par ID
router.get('/:id', (req, res) => {
  try {
    const chantier = Chantier.getById(req.params.id);
    if (!chantier) {
      return res.status(404).json({ error: 'Chantier non trouvé' });
    }

    // Récupérer aussi les photos du chantier
    const photos = Chantier.getPhotos(req.params.id);
    chantier.photos = photos;

    res.json(chantier);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du chantier' });
  }
});

// GET chantiers par client
router.get('/client/:clientId', (req, res) => {
  try {
    const chantiers = Chantier.getByClientId(req.params.clientId);
    res.json(chantiers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des chantiers du client' });
  }
});

// POST créer un nouveau chantier
router.post('/', (req, res) => {
  try {
    const chantierId = Chantier.create(req.body);
    const chantier = Chantier.getById(chantierId);
    res.status(201).json(chantier);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du chantier' });
  }
});

// PUT mettre à jour un chantier
router.put('/:id', (req, res) => {
  try {
    Chantier.update(req.params.id, req.body);
    const chantier = Chantier.getById(req.params.id);
    res.json(chantier);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du chantier' });
  }
});

// DELETE supprimer un chantier
router.delete('/:id', (req, res) => {
  try {
    Chantier.delete(req.params.id);
    res.json({ message: 'Chantier supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du chantier' });
  }
});

export default router;
