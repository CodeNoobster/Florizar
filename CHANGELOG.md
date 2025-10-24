# Changelog Florizar

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/spec/v2.0.0.html).

## [2.0.0] - 2024-10-24

### 🚀 MISE À JOUR MAJEURE - Système de Contacts

Cette version apporte une refonte complète du système de gestion des clients, désormais transformé en système de contacts beaucoup plus flexible et puissant.

### ⚠️ BREAKING CHANGES

- **API**: L'endpoint `/api/clients` est déprécié (mais toujours fonctionnel pour rétrocompatibilité)
- **Base de données**: Migration automatique de la table `clients` vers `contacts`
- **Modèles**: Le modèle `Client` est remplacé par `Contact`

### ✨ Ajouté

#### Système de Contacts Avancé
- **Personnes physiques et morales**: Distinction entre particuliers et entreprises
  - Champs spécifiques pour les entreprises (SIRET, TVA intracommunautaire, forme juridique)
  - Raison sociale pour les personnes morales
- **Système de tags flexible**: Catégorisez vos contacts avec des tags personnalisables
  - Tags par défaut : Client, Prospect, Fournisseur, Partenaire, Ancien client
  - Couleurs personnalisables pour chaque tag
  - Association multiple : un contact peut avoir plusieurs tags
- **Relations entre contacts**:
  - Interlocuteurs : associez des contacts à une entreprise
  - Relations personnalisées (associé, famille, référent, etc.)
  - Fonction et notes pour chaque relation
- **Statut actif/inactif**: Gérez les contacts actifs et archivés
- **Téléphone secondaire**: Ajout d'un second numéro de téléphone
- **Champs entreprise**: SIRET, TVA, forme juridique

#### Nouvelles Routes API
- `GET /api/contacts` - Liste des contacts avec filtres (actif, type_personne)
- `GET /api/contacts/stats` - Statistiques des contacts
- `GET /api/contacts/search/:term` - Recherche de contacts
- `GET /api/contacts/by-tag/:tagId` - Contacts par tag
- `GET /api/contacts/:id` - Détails d'un contact
- `POST /api/contacts` - Créer un contact
- `PUT /api/contacts/:id` - Mettre à jour un contact
- `PATCH /api/contacts/:id/toggle-actif` - Basculer actif/inactif
- `DELETE /api/contacts/:id` - Supprimer un contact
- `POST /api/contacts/:id/tags/:tagId` - Ajouter un tag
- `DELETE /api/contacts/:id/tags/:tagId` - Retirer un tag
- `POST /api/contacts/:id/relations` - Créer une relation
- `DELETE /api/contacts/:id/relations/:relationId` - Supprimer une relation
- `GET /api/contacts/:id/interlocuteurs` - Liste des interlocuteurs

#### Gestion des Tags
- `GET /api/tags` - Liste de tous les tags
- `GET /api/tags/stats` - Tags avec nombre d'utilisations
- `GET /api/tags/top/:limit` - Tags les plus utilisés
- `GET /api/tags/:id` - Détails d'un tag
- `POST /api/tags` - Créer un tag
- `PUT /api/tags/:id` - Mettre à jour un tag
- `DELETE /api/tags/:id` - Supprimer un tag (si non utilisé)
- `GET /api/tags/search/:term` - Rechercher des tags

#### Scripts de Mise à Jour
- **UPDATE.bat** et **UPDATE.sh**: Scripts automatiques de mise à jour
  - Sauvegarde automatique avant mise à jour
  - Récupération depuis Git
  - Installation des dépendances
  - Audit de sécurité npm
  - Migration de base de données

### 🔒 Sécurité

#### Protection Multi-Couches
- **Helmet.js**: Protection des headers HTTP
  - Content Security Policy (CSP)
  - HTTP Strict Transport Security (HSTS)
  - Protection XSS
  - Protection clickjacking
- **Rate Limiting**: Protection contre les attaques par force brute
  - API générale: 100 req/15min
  - Authentification: 5 tentatives/15min
  - Uploads: 20 fichiers/heure
- **Validation stricte**: Tous les inputs validés et sanitizés
  - Protection XSS
  - Protection injection SQL
  - Protection path traversal
- **Mots de passe forts**: Politique renforcée
  - Minimum 8 caractères
  - Majuscule, minuscule, chiffre, caractère spécial obligatoires
- **Upload sécurisé**:
  - Vérification type MIME + extension
  - Noms de fichiers crypto-random
  - Limite 10MB par fichier
  - Types autorisés: images uniquement
- **CORS configuré**: Whitelist d'origines autorisées
- **JWT renforcé**: Validation secret 32+ caractères au démarrage
- **Logs de sécurité**: Traçabilité complète
  - Connexions réussies/échouées avec IP
  - Activités suspectes détectées
  - Audit trail complet

#### Nouveaux Middlewares de Sécurité
- `backend/src/middleware/security.js` - Configuration de sécurité centralisée
- `backend/src/middleware/validators.js` - Validation complète des inputs

### 🗄️ Base de Données

#### Migration Automatique
- Système de migrations avec rollback automatique
- Sauvegarde automatique avant chaque migration
- Version tracking pour évolutions futures
- Conservation des données existantes garantie

#### Nouvelles Tables
- **contacts** : Remplace clients avec champs étendus
- **tags** : Tags personnalisables
- **contact_tags** : Relation many-to-many contacts ↔ tags
- **contact_relations** : Relations entre contacts
- **Index de performance** : Sur tous les champs de recherche fréquents

### 📝 Documentation

- **SECURITE.md**: Guide complet de sécurité
  - Mesures implémentées
  - Configuration requise
  - Bonnes pratiques
  - Détection d'incidents
- **.env.example**: Fichier d'exemple détaillé et commenté
- **UPDATE.bat/UPDATE.sh**: Scripts de mise à jour documentés

### 🔄 Migration des Données

La migration est **automatique** et **sécurisée**:
1. Sauvegarde automatique avant migration
2. Conversion de tous les clients existants en contacts
3. Attribution automatique du tag "Client"
4. Rollback automatique en cas d'erreur
5. Conservation de toutes les données existantes

### 🔧 Technique

#### Modèles
- **Contact.js**: Nouveau modèle avec méthodes étendues
  - `getAll(filters)` - Avec filtres actif/type
  - `getTags(id)` - Tags d'un contact
  - `addTag(id, tagId)` - Ajouter un tag
  - `getRelations(id)` - Relations d'un contact
  - `addRelation()` - Créer une relation
  - `toggleActif(id)` - Basculer actif/inactif
  - `getStats()` - Statistiques globales
- **Tag.js**: Gestion des tags
- **Chantier.js**: Mis à jour pour utiliser `contact_id`

#### Rétrocompatibilité
- `/api/clients/*` redirige vers `/api/contacts/*`
- Modèle `Client.js` maintenu pour compatibilité
- `client_id` accepté (converti en `contact_id`)

### 🐛 Corrections

- Gestion d'erreurs améliorée dans toutes les routes
- Validation des IDs avant toute opération
- Messages d'erreur plus explicites
- Logging systématique des opérations

### 📊 Performance

- Index sur tous les champs de recherche
- Requêtes optimisées avec JOINs efficaces
- Limitation des résultats de recherche (50 max)

---

## [1.0.0] - 2024-10-24

### Version Initiale

#### Ajouté
- Authentification JWT
- Gestion des clients
- Gestion des chantiers
- Upload de photos
- Interface responsive dark
- Base de données SQLite
- Dockerisation
- Scripts de démarrage
- Système de sauvegarde/restauration

---

## Format des Versions

### Types de changements
- **✨ Ajouté** : nouvelles fonctionnalités
- **🔧 Modifié** : changements dans des fonctionnalités existantes
- **🗑️ Déprécié** : fonctionnalités qui seront supprimées
- **🔥 Supprimé** : fonctionnalités supprimées
- **🐛 Corrigé** : corrections de bugs
- **🔒 Sécurité** : corrections de vulnérabilités
- **🗄️ Base de données** : modifications du schéma
- **📝 Documentation** : ajouts ou modifications de documentation
