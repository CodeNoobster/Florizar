import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    if (User.findByUsername(username)) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }

    if (User.findByEmail(email)) {
      return res.status(400).json({ error: 'Cet email existe déjà' });
    }

    const userId = User.create(username, email, password);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      userId
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

export const login = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const user = User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const validPassword = User.comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

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
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};
