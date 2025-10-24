# 🌿 Florizar - Gestion de Chantiers Paysagistes

Application web complète pour la gestion de chantiers paysagistes avec suivi des clients, des travaux et des photos.

## 📋 Fonctionnalités

### Gestion des Clients
- Création de fiches clients détaillées (nom, contact, adresse, notes)
- Modification et suppression des clients
- Recherche de clients
- Vue en grille responsive

### Gestion des Chantiers
- Création de chantiers avec dates de début/fin
- Suivi du statut (planifié, en cours, terminé, annulé)
- Résumé des travaux effectués
- Notes pour les interventions futures
- Association avec les clients
- Upload et gestion de photos par chantier

### Sécurité
- Authentification JWT
- Gestion des sessions utilisateur
- Protection des routes API

### Interface
- Thème sombre moderne et responsive
- Design adapté mobile/tablette/desktop
- Navigation intuitive
- Tableau de bord avec statistiques

## 🛠️ Technologies utilisées

### Backend
- **Node.js** + **Express** - Serveur API REST
- **SQLite** avec **better-sqlite3** - Base de données
- **JWT** - Authentification
- **Multer** - Upload de fichiers
- **bcryptjs** - Hashage des mots de passe

### Frontend
- **React 18** - Interface utilisateur
- **Vite** - Build tool rapide
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **CSS moderne** - Thème sombre responsive

## 📦 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### 1. Installation du backend

```bash
cd backend
npm install
```

### 2. Installation du frontend

```bash
cd frontend
npm install
```

## 🚀 Démarrage

### 1. Démarrer le backend (dans le dossier backend)

```bash
npm start
# ou en mode développement avec auto-reload
npm run dev
```

Le serveur démarre sur **http://localhost:5000**

### 2. Démarrer le frontend (dans le dossier frontend)

```bash
npm run dev
```

L'application démarre sur **http://localhost:3000**

## 📱 Utilisation

### Première connexion

1. Ouvrez **http://localhost:3000** dans votre navigateur
2. Créez un compte en cliquant sur "S'inscrire"
3. Connectez-vous avec vos identifiants

### Gestion des clients

1. Cliquez sur "Clients" dans la navigation
2. Cliquez sur "+ Nouveau Client" pour ajouter un client
3. Remplissez les informations et sauvegardez
4. Vous pouvez modifier ou supprimer les clients depuis leurs fiches

### Gestion des chantiers

1. Cliquez sur "Chantiers" dans la navigation
2. Cliquez sur "+ Nouveau Chantier"
3. Sélectionnez un client existant
4. Remplissez les détails du chantier :
   - Titre
   - Dates de début et fin
   - Statut
   - Résumé des travaux
   - Notes pour la prochaine fois
5. Une fois le chantier créé, cliquez sur "📷 Photos" pour ajouter des photos

## 📂 Structure du projet

```
Florizar/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration BDD
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   ├── controllers/    # Logique métier
│   │   ├── middleware/     # Middleware auth
│   │   └── server.js       # Serveur Express
│   ├── uploads/            # Photos uploadées
│   ├── package.json
│   └── .env                # Variables d'environnement
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/          # Pages de l'app
│   │   ├── services/       # API et contextes
│   │   ├── styles/         # CSS
│   │   ├── App.jsx         # App principale
│   │   └── main.jsx        # Point d'entrée
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔧 Configuration

### Variables d'environnement (backend/.env)

```env
PORT=5000
JWT_SECRET=votre_secret_jwt_tres_securise
NODE_ENV=development
```

**⚠️ Important** : Changez le JWT_SECRET en production !

## 🗄️ Base de données

L'application utilise SQLite avec 4 tables principales :

- **users** - Utilisateurs de l'application
- **clients** - Fiches clients
- **chantiers** - Chantiers avec détails
- **photos** - Photos liées aux chantiers

La base de données est créée automatiquement au premier démarrage dans `backend/database.sqlite`.

## 🎨 Thème

L'application utilise un thème sombre moderne avec :
- Palette de couleurs cohérente
- Design responsive (mobile, tablette, desktop)
- Animations et transitions fluides
- Composants réutilisables

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT avec expiration
- Protection des routes sensibles
- Validation des uploads de fichiers
- Limitation de la taille des fichiers (10MB max)

## 📝 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Clients (authentification requise)
- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Chantiers (authentification requise)
- `GET /api/chantiers` - Liste des chantiers
- `GET /api/chantiers/:id` - Détails d'un chantier
- `POST /api/chantiers` - Créer un chantier
- `PUT /api/chantiers/:id` - Modifier un chantier
- `DELETE /api/chantiers/:id` - Supprimer un chantier

### Photos (authentification requise)
- `POST /api/photos/upload/:chantierId` - Upload une photo
- `POST /api/photos/upload-multiple/:chantierId` - Upload plusieurs photos
- `GET /api/photos/chantier/:chantierId` - Photos d'un chantier
- `DELETE /api/photos/:id` - Supprimer une photo

## 🚧 Améliorations futures possibles

- Export PDF des chantiers
- Calendrier des interventions
- Gestion des devis
- Facturation
- Application mobile
- Mode hors ligne
- Notifications
- Statistiques avancées

## 📄 Licence

MIT

---

Créé avec ❤️ pour les paysagistes professionnels
