/**
 * ROUTE DE COMPATIBILITÉ
 *
 * Ce fichier maintient la rétrocompatibilité avec l'ancien endpoint /api/clients
 * Toutes les requêtes sont redirigées vers le nouveau système /api/contacts
 *
 * Migration: clients → contacts
 * - La table 'clients' a été renommée en 'contacts'
 * - Le modèle 'Contact' remplace 'Client'
 * - De nouvelles fonctionnalités ont été ajoutées (tags, relations, personnes morales)
 *
 * Cette route sera dépréciée dans une version future.
 * Utilisez /api/contacts pour les nouvelles implémentations.
 */

import contactsRoutes from './contacts.js';

// Réexporter directement les routes contacts
// Cela permet à /api/clients/* de fonctionner exactement comme /api/contacts/*
export default contactsRoutes;
