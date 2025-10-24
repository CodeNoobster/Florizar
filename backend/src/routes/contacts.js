import express from 'express';
import Contact from '../models/Contact.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// Validation pour création/modification de contact
const validateContact = [
  body('type_personne')
    .optional()
    .isIn(['physique', 'morale'])
    .withMessage('Le type de personne doit être "physique" ou "morale"'),

  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .escape(),

  body('prenom')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le prénom est trop long')
    .escape(),

  body('raison_sociale')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La raison sociale est trop longue')
    .escape(),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('L\'email doit être valide')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('L\'email est trop long'),

  body('telephone')
    .optional()
    .trim()
    .matches(/^[0-9\s\-\+\(\)\.]+$/)
    .withMessage('Le numéro de téléphone n\'est pas valide')
    .isLength({ max: 20 })
    .withMessage('Le numéro de téléphone est trop long'),

  body('telephone_secondaire')
    .optional()
    .trim()
    .matches(/^[0-9\s\-\+\(\)\.]+$/)
    .withMessage('Le numéro de téléphone secondaire n\'est pas valide')
    .isLength({ max: 20 })
    .withMessage('Le numéro est trop long'),

  body('adresse')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('L\'adresse est trop longue')
    .escape(),

  body('ville')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La ville est trop longue')
    .escape(),

  body('code_postal')
    .optional()
    .trim()
    .matches(/^[0-9]{5}$/)
    .withMessage('Le code postal doit contenir 5 chiffres'),

  body('pays')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le pays est trop long')
    .escape(),

  body('siret')
    .optional()
    .trim()
    .matches(/^[0-9]{14}$/)
    .withMessage('Le SIRET doit contenir 14 chiffres'),

  body('tva_intracommunautaire')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Le numéro de TVA est trop long'),

  body('forme_juridique')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La forme juridique est trop longue')
    .escape(),

  body('actif')
    .optional()
    .isBoolean()
    .withMessage('Le statut actif doit être un booléen'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Les notes sont trop longues'),

  handleValidationErrors,
];

// GET tous les contacts avec filtres optionnels
router.get('/', [
  query('actif').optional().isBoolean().withMessage('actif doit être un booléen'),
  query('type_personne').optional().isIn(['physique', 'morale']).withMessage('type_personne invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    const filters = {};
    if (req.query.actif !== undefined) {
      filters.actif = req.query.actif === 'true' || req.query.actif === '1';
    }
    if (req.query.type_personne) {
      filters.type_personne = req.query.type_personne;
    }

    const contacts = Contact.getAll(filters);
    res.json(contacts);
  } catch (error) {
    console.error('Erreur récupération contacts:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contacts' });
  }
});

// GET statistiques des contacts
router.get('/stats', (req, res) => {
  try {
    const stats = Contact.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Erreur récupération stats contacts:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// GET rechercher des contacts
router.get('/search/:term', (req, res) => {
  try {
    const filters = {};
    if (req.query.actif !== undefined) {
      filters.actif = req.query.actif === 'true' || req.query.actif === '1';
    }
    if (req.query.type_personne) {
      filters.type_personne = req.query.type_personne;
    }

    const contacts = Contact.search(req.params.term, filters);
    res.json(contacts);
  } catch (error) {
    console.error('Erreur recherche contacts:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche de contacts' });
  }
});

// GET contacts par tag
router.get('/by-tag/:tagId', [
  param('tagId').isInt({ min: 1 }).withMessage('ID de tag invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    const filters = {};
    if (req.query.actif !== undefined) {
      filters.actif = req.query.actif === 'true' || req.query.actif === '1';
    }

    const contacts = Contact.getByTag(req.params.tagId, filters);
    res.json(contacts);
  } catch (error) {
    console.error('Erreur récupération contacts par tag:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contacts par tag' });
  }
});

// GET un contact par ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    const contact = Contact.getById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact non trouvé' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Erreur récupération contact:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du contact' });
  }
});

// POST créer un nouveau contact
router.post('/', validateContact, (req, res) => {
  try {
    const contactId = Contact.create(req.body);
    const contact = Contact.getById(contactId);
    console.log(`✅ Nouveau contact créé: ${contact.nom} ${contact.prenom || contact.raison_sociale || ''} (ID: ${contactId})`);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Erreur création contact:', error);
    res.status(500).json({ error: 'Erreur lors de la création du contact' });
  }
});

// PUT mettre à jour un contact
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  ...validateContact,
], (req, res) => {
  try {
    const existingContact = Contact.getById(req.params.id);
    if (!existingContact) {
      return res.status(404).json({ error: 'Contact non trouvé' });
    }
    Contact.update(req.params.id, req.body);
    const contact = Contact.getById(req.params.id);
    console.log(`✅ Contact mis à jour: ${contact.nom} (ID: ${req.params.id})`);
    res.json(contact);
  } catch (error) {
    console.error('Erreur mise à jour contact:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du contact' });
  }
});

// PATCH basculer le statut actif/inactif
router.patch('/:id/toggle-actif', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    const existingContact = Contact.getById(req.params.id);
    if (!existingContact) {
      return res.status(404).json({ error: 'Contact non trouvé' });
    }
    Contact.toggleActif(req.params.id);
    const contact = Contact.getById(req.params.id);
    console.log(`✅ Statut contact basculé: ${contact.nom} -> ${contact.actif ? 'actif' : 'inactif'}`);
    res.json(contact);
  } catch (error) {
    console.error('Erreur toggle actif contact:', error);
    res.status(500).json({ error: 'Erreur lors du changement de statut' });
  }
});

// DELETE supprimer un contact
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    const existingContact = Contact.getById(req.params.id);
    if (!existingContact) {
      return res.status(404).json({ error: 'Contact non trouvé' });
    }
    Contact.delete(req.params.id);
    console.log(`✅ Contact supprimé: ${existingContact.nom} (ID: ${req.params.id})`);
    res.json({ message: 'Contact supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression contact:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du contact' });
  }
});

// === GESTION DES TAGS ===

// POST ajouter un tag à un contact
router.post('/:id/tags/:tagId', [
  param('id').isInt({ min: 1 }).withMessage('ID contact invalide'),
  param('tagId').isInt({ min: 1 }).withMessage('ID tag invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    Contact.addTag(req.params.id, req.params.tagId);
    const contact = Contact.getById(req.params.id);
    console.log(`✅ Tag ajouté au contact ${req.params.id}`);
    res.json(contact);
  } catch (error) {
    console.error('Erreur ajout tag:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du tag' });
  }
});

// DELETE retirer un tag d'un contact
router.delete('/:id/tags/:tagId', [
  param('id').isInt({ min: 1 }).withMessage('ID contact invalide'),
  param('tagId').isInt({ min: 1 }).withMessage('ID tag invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    Contact.removeTag(req.params.id, req.params.tagId);
    const contact = Contact.getById(req.params.id);
    console.log(`✅ Tag retiré du contact ${req.params.id}`);
    res.json(contact);
  } catch (error) {
    console.error('Erreur retrait tag:', error);
    res.status(500).json({ error: 'Erreur lors du retrait du tag' });
  }
});

// === GESTION DES RELATIONS ===

// POST ajouter une relation entre contacts
router.post('/:id/relations', [
  param('id').isInt({ min: 1 }).withMessage('ID contact invalide'),
  body('contact_lie_id').isInt({ min: 1 }).withMessage('ID du contact lié requis'),
  body('type_relation')
    .trim()
    .notEmpty()
    .withMessage('Le type de relation est requis')
    .isIn(['interlocuteur', 'associe', 'famille', 'referent', 'autre'])
    .withMessage('Type de relation invalide'),
  body('fonction').optional().trim().isLength({ max: 100 }),
  body('notes').optional().trim().isLength({ max: 500 }),
  handleValidationErrors,
], (req, res) => {
  try {
    const { contact_lie_id, type_relation, fonction, notes } = req.body;
    Contact.addRelation(req.params.id, contact_lie_id, type_relation, fonction, notes);
    const contact = Contact.getById(req.params.id);
    console.log(`✅ Relation créée: contact ${req.params.id} -> ${contact_lie_id} (${type_relation})`);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Erreur ajout relation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la relation' });
  }
});

// DELETE supprimer une relation
router.delete('/:id/relations/:relationId', [
  param('id').isInt({ min: 1 }).withMessage('ID contact invalide'),
  param('relationId').isInt({ min: 1 }).withMessage('ID relation invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    Contact.removeRelation(req.params.relationId);
    const contact = Contact.getById(req.params.id);
    console.log(`✅ Relation supprimée (ID: ${req.params.relationId})`);
    res.json(contact);
  } catch (error) {
    console.error('Erreur suppression relation:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation' });
  }
});

// GET interlocuteurs d'une entreprise
router.get('/:id/interlocuteurs', [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors,
], (req, res) => {
  try {
    const interlocuteurs = Contact.getInterlocuteurs(req.params.id);
    res.json(interlocuteurs);
  } catch (error) {
    console.error('Erreur récupération interlocuteurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des interlocuteurs' });
  }
});

export default router;
