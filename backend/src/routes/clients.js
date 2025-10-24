import express from 'express';
import Client from '../models/Client.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateClient, validateIdParam } from '../middleware/validators.js';

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// GET tous les clients
router.get('/', (req, res) => {
  try {
    const clients = Client.getAll();
    res.json(clients);
  } catch (error) {
    console.error('Erreur récupération clients:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
  }
});

// GET un client par ID
router.get('/:id', validateIdParam, (req, res) => {
  try {
    const client = Client.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(client);
  } catch (error) {
    console.error('Erreur récupération client:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du client' });
  }
});

// POST créer un nouveau client
router.post('/', validateClient, (req, res) => {
  try {
    const clientId = Client.create(req.body);
    const client = Client.getById(clientId);
    console.log(`✅ Nouveau client créé: ${client.nom} (ID: ${clientId})`);
    res.status(201).json(client);
  } catch (error) {
    console.error('Erreur création client:', error);
    res.status(500).json({ error: 'Erreur lors de la création du client' });
  }
});

// PUT mettre à jour un client
router.put('/:id', validateIdParam, validateClient, (req, res) => {
  try {
    const existingClient = Client.getById(req.params.id);
    if (!existingClient) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    Client.update(req.params.id, req.body);
    const client = Client.getById(req.params.id);
    console.log(`✅ Client mis à jour: ${client.nom} (ID: ${req.params.id})`);
    res.json(client);
  } catch (error) {
    console.error('Erreur mise à jour client:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du client' });
  }
});

// DELETE supprimer un client
router.delete('/:id', validateIdParam, (req, res) => {
  try {
    const existingClient = Client.getById(req.params.id);
    if (!existingClient) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    Client.delete(req.params.id);
    console.log(`✅ Client supprimé: ${existingClient.nom} (ID: ${req.params.id})`);
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression client:', error);
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
