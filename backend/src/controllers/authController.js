import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validatePasswordStrength } from '../middleware/security.js';

export const register = (req, res) => {
  try {
    const { username, email, password } = req.body;

    // La validation de base est déjà faite par le middleware validator
    // Ici on fait une double vérification de la force du mot de passe
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        error: 'Mot de passe trop faible',
        details: passwordCheck.errors
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = User.findByUsername(username);
    if (existingUser) {
      // Log de tentative de création avec username existant (potentielle reconnaissance)
      console.warn(`⚠️  Tentative d'inscription avec username existant: ${username} - IP: ${req.ip}`);
      return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }

    const existingEmail = User.findByEmail(email);
    if (existingEmail) {
      console.warn(`⚠️  Tentative d'inscription avec email existant: ${email} - IP: ${req.ip}`);
      return res.status(400).json({ error: 'Cet email existe déjà' });
    }

    const userId = User.create(username, email, password);

    console.log(`✅ Nouvel utilisateur créé: ${username} (ID: ${userId}) - IP: ${req.ip}`);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      userId
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

export const login = (req, res) => {
  try {
    const { username, password } = req.body;

    // La validation de base est déjà faite par le middleware validator

    const user = User.findByUsername(username);

    if (!user) {
      // Ne pas révéler si le username existe ou non (protection contre énumération)
      console.warn(`⚠️  Tentative de connexion avec username inconnu: ${username} - IP: ${req.ip}`);
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const validPassword = User.comparePassword(password, user.password);

    if (!validPassword) {
      // Log de tentative de connexion échouée (possible attaque par force brute)
      console.warn(`⚠️  Tentative de connexion échouée pour: ${username} - IP: ${req.ip}`);
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Connexion réussie
    console.log(`✅ Connexion réussie: ${username} (ID: ${user.id}) - IP: ${req.ip}`);

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};
