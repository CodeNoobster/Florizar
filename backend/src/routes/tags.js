import express from 'express';
import Tag from '../models/Tag.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// Validation pour création/modification de tag
const validateTag = [
  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Le nom du tag est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .escape(),

  body('couleur')
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('La couleur doit être au format hexadécimal (#RRGGBB)'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La description est trop longue (max 200 caractères)'),

  handleValidationErrors,
];

// GET tous les tags
router.get('/', (req, res) => {
  try {
    const tags = Tag.getAll();
    res.json(tags);
  } catch (error) {
    console.error('Erreur récupération tags:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tags' });
  }
});

// GET tags avec nombre d'utilisations
router.get('/stats', (req, res) => {
  try {
    const tags = Tag.getAllWithCount();
    res.json(tags);
  } catch (error) {
    console.error('Erreur récupération stats tags:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques des tags' });
  }
});

// GET tags les plus utilisés
router.get('/top/:limit?', (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const tags = Tag.getTopUsed(limit);
    res.json(tags);
  } catch (error) {
    console.error('Erreur récupération top tags:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tags les plus utilisés' });
  }
});

// GET un tag par ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    const tag = Tag.getById(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag non trouvé' });
    }
    res.json(tag);
  } catch (error) {
    console.error('Erreur récupération tag:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du tag' });
  }
});

// POST créer un nouveau tag
router.post('/', validateTag, (req, res) => {
  try {
    const tagId = Tag.create(req.body);
    const tag = Tag.getById(tagId);
    console.log(`✅ Nouveau tag créé: ${tag.nom} (ID: ${tagId})`);
    res.status(201).json(tag);
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Un tag avec ce nom existe déjà' });
    }
    console.error('Erreur création tag:', error);
    res.status(500).json({ error: 'Erreur lors de la création du tag' });
  }
});

// PUT mettre à jour un tag
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  ...validateTag,
], (req, res) => {
  try {
    const existingTag = Tag.getById(req.params.id);
    if (!existingTag) {
      return res.status(404).json({ error: 'Tag non trouvé' });
    }
    Tag.update(req.params.id, req.body);
    const tag = Tag.getById(req.params.id);
    console.log(`✅ Tag mis à jour: ${tag.nom} (ID: ${req.params.id})`);
    res.json(tag);
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Un tag avec ce nom existe déjà' });
    }
    console.error('Erreur mise à jour tag:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du tag' });
  }
});

// DELETE supprimer un tag
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    const existingTag = Tag.getById(req.params.id);
    if (!existingTag) {
      return res.status(404).json({ error: 'Tag non trouvé' });
    }

    // Vérifier si le tag est utilisé
    if (existingTag.contactCount > 0) {
      return res.status(400).json({
        error: 'Impossible de supprimer ce tag',
        message: `Ce tag est utilisé par ${existingTag.contactCount} contact(s). Retirez-le d'abord des contacts.`
      });
    }

    Tag.delete(req.params.id);
    console.log(`✅ Tag supprimé: ${existingTag.nom} (ID: ${req.params.id})`);
    res.json({ message: 'Tag supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression tag:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du tag' });
  }
});

// GET rechercher des tags
router.get('/search/:term', (req, res) => {
  try {
    const tags = Tag.search(req.params.term);
    res.json(tags);
  } catch (error) {
    console.error('Erreur recherche tags:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche de tags' });
  }
});

export default router;
