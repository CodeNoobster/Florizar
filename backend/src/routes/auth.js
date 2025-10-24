import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validators.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

// Appliquer rate limiting strict sur les routes d'authentification
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);

export default router;
