# 🌿 Florizar - Gestion de Chantiers Paysagistes

Application web complète pour la gestion de chantiers paysagistes avec suivi des clients, des travaux et des photos.

## 📋 Fonctionnalités

### Architecture Évolutive
- **Structure modulaire** prête pour l'ajout de nouvelles fonctionnalités
- **Sidebar collapsable** avec navigation extensible par sections
- **Base de données complète** avec tables préparées pour :
  - Devis et factures
  - Interventions détaillées
  - Gestion d'équipements
  - Et bien plus...

### Gestion des Clients
- Création de fiches clients complètes (coordonnées, entreprise, notes)
- **Page de détail client** avec vue d'ensemble de tous ses chantiers
- Modification et suppression des clients
- Recherche et filtrage
- Vue en grille responsive
- **Relation 1-N** : Un client peut avoir plusieurs chantiers

### Gestion des Chantiers
- Création de chantiers liés à un client
- Suivi du statut (planifié, en cours, terminé, annulé)
- Dates de début, fin et prévisions
- Résumé des travaux effectués
- Notes pour les interventions futures
- Upload et galerie de photos par chantier
- **Navigation facile** entre clients et leurs chantiers

### Sécurité
- Authentification JWT
- Gestion des sessions utilisateur
- Protection des routes API
- Hashage sécurisé des mots de passe

### Interface Moderne
- **Sidebar collapsable** avec menu extensible
- Thème sombre moderne et responsive
- Design adapté mobile/tablette/desktop
- Navigation intuitive par sections
- Tableau de bord avec statistiques
- Topbar avec accès rapide

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

1. Cliquez sur "Clients" dans la sidebar (section Gestion)
2. Cliquez sur "+ Nouveau Client" pour ajouter un client
3. Remplissez les informations et sauvegardez
4. Cliquez sur "Voir détails" pour accéder à la fiche complète du client
5. Sur la page de détail, vous voyez tous les chantiers du client
6. Vous pouvez modifier ou supprimer les clients

### Gestion des chantiers

1. Cliquez sur "Chantiers" dans la sidebar (section Gestion)
2. Cliquez sur "+ Nouveau Chantier"
3. **Sélectionnez un client** (un chantier appartient à un seul client)
4. Remplissez les détails du chantier :
   - Titre
   - Dates de début et fin
   - Statut
   - Résumé des travaux effectués
   - Notes pour la prochaine fois
5. Une fois le chantier créé, cliquez sur "📷 Photos" pour ajouter des photos

**Astuce** : Depuis la fiche d'un client, vous pouvez créer directement un chantier pour ce client !

## 📂 Structure du projet

```
Florizar/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Config BDD évolutive
│   │   ├── models/                 # Modèles de données
│   │   │   ├── User.js
│   │   │   ├── Client.js
│   │   │   ├── Chantier.js
│   │   │   └── Photo.js
│   │   ├── routes/                 # Routes API REST
│   │   │   ├── auth.js
│   │   │   ├── clients.js
│   │   │   ├── chantiers.js
│   │   │   └── photos.js
│   │   ├── controllers/            # Logique métier
│   │   ├── middleware/             # Middleware auth
│   │   └── server.js               # Serveur Express
│   ├── uploads/                    # Photos uploadées
│   ├── database.sqlite             # Base de données
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Composants réutilisables
│   │   │   ├── Sidebar.jsx         # Sidebar collapsable
│   │   │   ├── Topbar.jsx          # Barre supérieure
│   │   │   ├── Layout.jsx          # Layout principal
│   │   │   └── PrivateRoute.jsx    # Protection routes
│   │   ├── pages/                  # Pages de l'application
│   │   │   ├── Login.jsx           # Connexion/Inscription
│   │   │   ├── Dashboard.jsx       # Tableau de bord
│   │   │   ├── Clients.jsx         # Liste des clients
│   │   │   ├── ClientDetail.jsx    # Détail client + chantiers
│   │   │   └── Chantiers.jsx       # Gestion des chantiers
│   │   ├── services/
│   │   │   ├── api.js              # Services API
│   │   │   └── AuthContext.jsx     # Contexte auth
│   │   ├── styles/
│   │   │   └── index.css           # Thème global
│   │   ├── App.jsx
│   │   └── main.jsx
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

## 🗄️ Base de données évolutive

L'application utilise SQLite avec une **structure extensible** comprenant :

### Tables actuellement utilisées :
- **users** - Utilisateurs avec rôles
- **clients** - Fiches clients détaillées (avec type client, téléphones multiples, etc.)
- **chantiers** - Chantiers complets (budget, superficie, priorité, etc.)
- **photos** - Photos avec ordre et catégories
- **interventions** - Suivi détaillé des interventions sur chantiers

### Tables préparées pour futures fonctionnalités :
- **devis** + **devis_lignes** - Gestion de devis détaillés
- **factures** - Facturation liée aux chantiers et devis
- **equipements** + **chantiers_equipements** - Gestion du matériel

### Optimisations :
- Index sur les clés étrangères pour performances
- Contraintes d'intégrité référentielle
- Cascade pour suppressions cohérentes

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

## 🚧 Fonctionnalités à venir (base déjà préparée)

L'architecture modulaire et la base de données sont déjà prêtes pour :

### Commercial
- ✨ Gestion des devis avec lignes détaillées
- ✨ Facturation liée aux chantiers
- ✨ Suivi des paiements
- ✨ Export PDF

### Planning
- ✨ Calendrier des interventions
- ✨ Gestion des équipements/matériels
- ✨ Planning des ouvriers
- ✨ Suivi du temps par chantier

### Statistiques & Rapports
- ✨ Tableaux de bord avancés
- ✨ Rapports financiers
- ✨ Analyse de rentabilité
- ✨ Export des données

### Autres
- ✨ Notifications et rappels
- ✨ Mode hors ligne
- ✨ Application mobile
- ✨ Multi-utilisateurs avec rôles

**Note** : Les tables de base de données pour ces fonctionnalités sont déjà créées et prêtes à l'emploi !

## 📄 Licence

MIT

---

Créé avec ❤️ pour les paysagistes professionnels
