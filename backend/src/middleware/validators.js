import { body, param, validationResult } from 'express-validator';

/**
 * Middleware pour vérifier les résultats de validation
 * Retourne les erreurs au format JSON si la validation échoue
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation pour l'inscription d'un utilisateur
 */
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores')
    .escape(),

  body('email')
    .trim()
    .isEmail()
    .withMessage('L\'email doit être valide')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('L\'email est trop long'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*...)'),

  handleValidationErrors,
];

/**
 * Validation pour la connexion
 */
export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Le nom d\'utilisateur est requis')
    .isLength({ max: 30 })
    .withMessage('Nom d\'utilisateur invalide')
    .escape(),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .isLength({ max: 100 })
    .withMessage('Mot de passe invalide'),

  handleValidationErrors,
];

/**
 * Validation pour la création d'un client
 */
export const validateClient = [
  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Le nom du client est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .escape(),

  body('prenom')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le prénom est trop long')
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

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Les notes sont trop longues'),

  handleValidationErrors,
];

/**
 * Validation pour la création/modification d'un chantier
 */
export const validateChantier = [
  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Le nom du chantier est requis')
    .isLength({ min: 2, max: 200 })
    .withMessage('Le nom doit contenir entre 2 et 200 caractères')
    .escape(),

  body('client_id')
    .notEmpty()
    .withMessage('L\'ID du client est requis')
    .isInt({ min: 1 })
    .withMessage('L\'ID du client doit être un entier positif'),

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

  body('date_debut')
    .optional()
    .isISO8601()
    .withMessage('La date de début doit être au format ISO 8601 (YYYY-MM-DD)'),

  body('date_fin')
    .optional()
    .isISO8601()
    .withMessage('La date de fin doit être au format ISO 8601 (YYYY-MM-DD)'),

  body('statut')
    .optional()
    .isIn(['planifie', 'en_cours', 'termine', 'annule'])
    .withMessage('Le statut doit être: planifie, en_cours, termine ou annule'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La description est trop longue'),

  body('travaux_realises')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Les travaux réalisés sont trop longs'),

  body('travaux_a_faire')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Les travaux à faire sont trop longs'),

  body('budget_estime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le budget estimé doit être un nombre positif'),

  body('cout_reel')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le coût réel doit être un nombre positif'),

  body('superficie')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La superficie doit être un nombre positif'),

  body('priorite')
    .optional()
    .isIn(['basse', 'moyenne', 'haute', 'urgente'])
    .withMessage('La priorité doit être: basse, moyenne, haute ou urgente'),

  handleValidationErrors,
];

/**
 * Validation pour la description d'une photo
 */
export const validatePhotoDescription = [
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description est trop longue (max 500 caractères)'),

  handleValidationErrors,
];

/**
 * Validation des paramètres ID dans les URLs
 */
export const validateIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('L\'ID doit être un entier positif'),

  handleValidationErrors,
];

export const validateClientIdParam = [
  param('clientId')
    .isInt({ min: 1 })
    .withMessage('L\'ID du client doit être un entier positif'),

  handleValidationErrors,
];

export const validateChantierIdParam = [
  param('chantierId')
    .isInt({ min: 1 })
    .withMessage('L\'ID du chantier doit être un entier positif'),

  handleValidationErrors,
];

/**
 * Validation pour les updates partiels (PATCH)
 * Vérifie qu'au moins un champ est fourni
 */
export const validateAtLeastOneField = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Au moins un champ doit être fourni pour la mise à jour',
    });
  }
  next();
};
