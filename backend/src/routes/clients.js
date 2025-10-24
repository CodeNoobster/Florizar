import express from 'express';
import Client from '../models/Client.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// GET tous les clients
router.get('/', (req, res) => {
  try {
    const clients = Client.getAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
  }
});

// GET un client par ID
router.get('/:id', (req, res) => {
  try {
    const client = Client.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du client' });
  }
});

// POST créer un nouveau client
router.post('/', (req, res) => {
  try {
    const clientId = Client.create(req.body);
    const client = Client.getById(clientId);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du client' });
  }
});

// PUT mettre à jour un client
router.put('/:id', (req, res) => {
  try {
    Client.update(req.params.id, req.body);
    const client = Client.getById(req.params.id);
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du client' });
  }
});

// DELETE supprimer un client
router.delete('/:id', (req, res) => {
  try {
    Client.delete(req.params.id);
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du client' });
  }
});

// GET rechercher des clients
router.get('/search/:term', (req, res) => {
  try {
    const clients = Client.searchByName(req.params.term);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la recherche de clients' });
  }
});

export default router;
