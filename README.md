# 🌿 Florizar - Gestion de Chantiers Paysagistes

Application web complète pour la gestion de chantiers paysagistes avec suivi des clients, des travaux et des photos.

## 🚀 Installation en 1 CLIC

### **Première fois ? Installez tout automatiquement !**

**Windows :**
```
Double-cliquez sur INSTALL.bat
```

**Linux / Mac :**
```bash
./INSTALL.sh
```

Le script **INSTALL** configure **automatiquement** :
- ✅ Toutes les dépendances (backend + frontend)
- ✅ Configuration de l'environnement (.env)
- ✅ Génération sécurisée du JWT_SECRET
- ✅ Tous les dossiers nécessaires

➜ **[Guide d'installation détaillé](README-INSTALLATION.md)**

---

## ⚡ Démarrage Rapide (Test & Itération)

### 🖱️ **Double-cliquez simplement sur un fichier :**

**Windows :**
- `START.bat` - Démarre l'application en mode développement
- `START-DOCKER.bat` - Démarre avec Docker

**Linux / macOS :**
- `START.sh` - Démarre l'application en mode développement
- `START-DOCKER.sh` - Démarre avec Docker

**Universel (Python) :**
- `start.py` - Fonctionne sur tous les systèmes

➜ **[Voir le guide de démarrage détaillé](DEMARRAGE-RAPIDE.md)**

**Prérequis :** Installez simplement [Node.js](https://nodejs.org/) pour le mode dev, ou [Docker](https://www.docker.com/products/docker-desktop) pour le mode Docker.

**Ensuite :** L'application s'ouvre automatiquement dans votre navigateur ! 🎉

---

## 🛡️ Protection des Données

### Vos données sont TOUJOURS conservées lors des mises à jour !

- ✅ **Base de données SQLite** : Jamais effacée, toujours conservée
- ✅ **Photos uploadées** : Persistées dans `uploads/` ou `data/uploads/`
- ✅ **Système de migration** : Évolution du schéma sans perte de données
- ✅ **Sauvegardes automatiques** : Avant chaque migration importante
- ✅ **Exclusion Git** : Vos données ne seront jamais commitées par erreur

### Sauvegardes

**Créer une sauvegarde :**
- Windows : Double-clic sur `BACKUP.bat`
- Linux/Mac : `./BACKUP.sh`

**Restaurer une sauvegarde :**
- Windows : Double-clic sur `RESTORE.bat`
- Linux/Mac : `./RESTORE.sh`

➜ **[Guide complet de mise à jour](MISE-A-JOUR.md)**

---

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

### Option 1 : Docker (Recommandé ⭐)

**Prérequis :**
- Docker et Docker Compose installés

**Installation en une commande :**

```bash
# Avec Make
make install

# OU avec Docker Compose directement
docker-compose up -d
```

L'application sera accessible sur **http://localhost**

**Commandes utiles :**
```bash
make logs          # Voir les logs
make restart       # Redémarrer
make down          # Arrêter
make ps            # Statut des conteneurs
make clean         # Nettoyer (⚠️ supprime les données)
```

### Option 2 : Installation manuelle (Développement)

**Prérequis :**
- Node.js (version 18 ou supérieure)
- npm ou yarn

#### 1. Installation du backend

```bash
cd backend
npm install
```

#### 2. Installation du frontend

```bash
cd frontend
npm install
```

## 🚀 Démarrage

### Avec Docker (Production)

```bash
# Démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

L'application est accessible sur **http://localhost**

### Manuel (Développement)

#### 1. Démarrer le backend (dans le dossier backend)

```bash
npm start
# ou en mode développement avec auto-reload
npm run dev
```

Le serveur démarre sur **http://localhost:5000**

#### 2. Démarrer le frontend (dans le dossier frontend)

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
│   ├── Dockerfile                  # Image Docker backend
│   ├── .dockerignore
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
│   ├── Dockerfile                  # Image Docker frontend
│   ├── nginx.conf                  # Configuration nginx
│   ├── .dockerignore
│   ├── package.json
│   └── vite.config.js
│
├── data/                           # Données persistantes (Docker)
│   ├── database.sqlite             # Base de données
│   └── uploads/                    # Photos uploadées
│
├── docker-compose.yml              # Orchestration Docker
├── Makefile                        # Commandes simplifiées
├── .dockerignore
├── .env.docker                     # Config Docker (exemple)
└── README.md
```

## 🔧 Configuration

### Docker (Production)

Copiez `.env.docker` vers `.env` et modifiez les valeurs :

```env
JWT_SECRET=votre_secret_jwt_tres_securise_change_me
```

**⚠️ Important** :
- Changez ABSOLUMENT le JWT_SECRET en production !
- Les données sont persistées dans le dossier `data/`

### Manuel (Développement)

Variables d'environnement dans `backend/.env` :

```env
PORT=5000
JWT_SECRET=votre_secret_jwt_tres_securise
NODE_ENV=development
```

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

## 🐳 Docker - Déploiement en production

### Architecture Docker

L'application est entièrement dockerisée et prête pour la production :

**Services :**
- **backend** : Node.js avec Express (API REST)
- **frontend** : React buildé + Nginx (serveur web et reverse proxy)

**Nginx** sert à :
- Servir les fichiers statiques React (frontend)
- Proxifier les requêtes `/api` vers le backend
- Servir les fichiers uploadés `/uploads`
- Gestion du cache et compression gzip

**Persistance :**
- Base de données SQLite : `./data/database.sqlite`
- Photos uploadées : `./data/uploads/`

### Commandes Docker

```bash
# Installation complète
make install

# Démarrer l'application
make up
# OU
docker-compose up -d

# Voir les logs en temps réel
make logs
# OU
docker-compose logs -f

# Redémarrer
make restart

# Arrêter
make down

# Voir le statut
make ps

# Accéder au shell backend
make shell-backend

# Nettoyer (⚠️ supprime les données)
make clean
```

### Configuration avancée

**Changer le port :**

Éditez `docker-compose.yml` :
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Application accessible sur port 8080
```

**Variables d'environnement :**

Créez un fichier `.env` :
```env
JWT_SECRET=votre_secret_super_securise
```

**Volumes personnalisés :**

Modifiez les chemins dans `docker-compose.yml` :
```yaml
volumes:
  - /chemin/custom/database.sqlite:/app/database.sqlite
  - /chemin/custom/uploads:/app/uploads
```

### Build des images

```bash
# Build complet
docker-compose build

# Build sans cache
docker-compose build --no-cache

# Build d'un service spécifique
docker-compose build backend
```

### Monitoring

```bash
# Logs backend seulement
docker-compose logs -f backend

# Logs frontend seulement
docker-compose logs -f frontend

# Healthcheck status
docker-compose ps
```

### Mise en production

**1. Sécurité :**
```bash
# Changez le JWT_SECRET
echo "JWT_SECRET=$(openssl rand -base64 32)" > .env
```

**2. Firewall :**
```bash
# Ouvrez uniquement le port 80 (ou 443 pour HTTPS)
ufw allow 80/tcp
```

**3. HTTPS avec Let's Encrypt :**

Ajoutez un service Certbot dans `docker-compose.yml` ou utilisez un reverse proxy (Traefik, Nginx Proxy Manager).

**4. Sauvegarde automatique :**
```bash
# Script de sauvegarde (à mettre dans cron)
#!/bin/bash
tar -czf backup-$(date +%Y%m%d).tar.gz data/
```

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
