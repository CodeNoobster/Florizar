import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

/**
 * Configuration Helmet pour sécuriser les headers HTTP
 * Protection contre XSS, clickjacking, MIME sniffing, etc.
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 an
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

/**
 * Rate limiter général pour toutes les requêtes API
 * Limite: 100 requêtes par 15 minutes par IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par fenêtre
  message: {
    error: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer dans 15 minutes.',
  },
  standardHeaders: true, // Retourne les infos de rate limit dans headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  // Fonction pour générer une clé unique par IP
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});

/**
 * Rate limiter strict pour les routes d'authentification
 * Protection contre les attaques par force brute
 * Limite: 5 tentatives par 15 minutes par IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 tentatives
  message: {
    error: 'Trop de tentatives de connexion. Votre IP est temporairement bloquée. Réessayez dans 15 minutes.',
  },
  skipSuccessfulRequests: true, // Ne compte que les échecs
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les uploads de fichiers
 * Limite: 20 uploads par heure par IP
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 20, // Max 20 uploads
  message: {
    error: 'Trop d\'uploads de fichiers. Limite atteinte. Réessayez dans 1 heure.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Sanitization des données contre les injections NoSQL
 * Bien que SQLite ne soit pas concerné par les injections NoSQL,
 * ce middleware nettoie les caractères dangereux dans les inputs
 */
export const sanitizer = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  Tentative d'injection détectée et bloquée - IP: ${req.ip}, Champ: ${key}`);
  },
});

/**
 * Protection contre HTTP Parameter Pollution
 * Empêche les attaques utilisant des paramètres dupliqués
 */
export const hppProtection = hpp();

/**
 * Middleware de logging des activités suspectes
 */
export const securityLogger = (req, res, next) => {
  const suspiciousPatterns = [
    /(<script|javascript:|onerror=)/i, // XSS
    /(union|select|insert|update|delete|drop|create|alter)/i, // SQL Injection
    /(\.\.\/|\.\.\\)/g, // Path traversal
    /(%27|%22|%3C|%3E)/i, // Encoded characters
  ];

  const checkString = (str) => {
    if (typeof str === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(str));
    }
    return false;
  };

  const checkObject = (obj) => {
    if (obj && typeof obj === 'object') {
      return Object.values(obj).some(val =>
        checkString(val) || checkObject(val)
      );
    }
    return false;
  };

  // Vérifier les paramètres de requête, le corps et les headers
  const suspicious =
    checkObject(req.query) ||
    checkObject(req.body) ||
    checkString(req.path);

  if (suspicious) {
    const timestamp = new Date().toISOString();
    console.error(`🚨 [SÉCURITÉ] ${timestamp} - Activité suspecte détectée!`);
    console.error(`   IP: ${req.ip}`);
    console.error(`   URL: ${req.method} ${req.originalUrl}`);
    console.error(`   User-Agent: ${req.get('user-agent')}`);
    console.error(`   Body: ${JSON.stringify(req.body).substring(0, 200)}`);

    // On peut choisir de bloquer la requête ou juste de la logger
    // Pour l'instant on log et on continue
  }

  next();
};

/**
 * Validation de la force du mot de passe
 * Exigences:
 * - Minimum 8 caractères
 * - Au moins une lettre majuscule
 * - Au moins une lettre minuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial
 */
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
  }
  if (!hasUpperCase) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }
  if (!hasLowerCase) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }
  if (!hasNumbers) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  if (!hasSpecialChar) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Middleware pour valider le JWT_SECRET au démarrage
 */
export const validateJWTSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('🚨 ERREUR CRITIQUE: JWT_SECRET non défini dans les variables d\'environnement!');
    console.error('   Définissez une clé secrète forte dans le fichier .env');
    console.error('   Exemple: JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire');
    process.exit(1);
  }

  if (secret.length < 32) {
    console.error('🚨 ERREUR CRITIQUE: JWT_SECRET trop court!');
    console.error(`   Longueur actuelle: ${secret.length} caractères`);
    console.error('   Longueur minimale requise: 32 caractères');
    console.error('   Générez une clé forte avec: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    process.exit(1);
  }

  console.log('✅ JWT_SECRET validé avec succès');
};
