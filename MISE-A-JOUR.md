# 🔄 Guide de Mise à Jour Florizar

## ⚠️ IMPORTANT : Vos données sont protégées !

Florizar est conçu pour **PRÉSERVER VOS DONNÉES** lors des mises à jour :

- ✅ La base de données SQLite n'est **JAMAIS effacée**
- ✅ Les photos uploadées sont **CONSERVÉES**
- ✅ Le système de migration gère l'évolution du schéma
- ✅ Les sauvegardes automatiques avant chaque migration

---

## 📋 Procédure de Mise à Jour

### 🛡️ Étape 1 : Sauvegarde (Recommandé)

**Avant toute mise à jour, sauvegardez vos données :**

**Windows :**
```batch
BACKUP.bat
```

**Linux / macOS :**
```bash
./BACKUP.sh
```

Cela crée une archive avec :
- Base de données
- Photos uploadées
- Horodatage pour traçabilité

---

### 🔄 Étape 2 : Récupérer les Mises à Jour

```bash
# Télécharger les dernières modifications
git pull origin main

# OU récupérer une nouvelle version
git fetch
git checkout v2.0.0  # exemple
```

---

### ⚙️ Étape 3 : Mettre à Jour les Dépendances

**Mode Développement :**

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

**Mode Docker :**
```bash
# Reconstruire les images
docker-compose build

# OU avec le Makefile
make rebuild
```

---

### 🚀 Étape 4 : Redémarrer

**Mode Développement :**
- Windows : Double-clic sur `START.bat`
- Linux/Mac : `./START.sh`

**Mode Docker :**
```bash
docker-compose down
docker-compose up -d
```

**Le système de migration se lance automatiquement au démarrage !**

---

## 🔧 Système de Migration Automatique

### Comment ça marche ?

1. **Au démarrage**, le serveur vérifie la version de votre BDD
2. **S'il y a des mises à jour** du schéma, elles sont appliquées automatiquement
3. **Une sauvegarde** est créée avant toute migration
4. **En cas d'erreur**, la base est restaurée automatiquement
5. **Les données existantes** sont TOUJOURS conservées

### Exemple de logs au démarrage :

```
📊 Version actuelle de la BDD: v1
🔄 2 migration(s) en attente...
💾 Sauvegarde créée: database_backup_v1.sqlite
🔄 Application de la migration v2: add_client_siret
✅ Migration v2: Ajout du SIRET client
🔄 Application de la migration v3: add_chantier_priority
✅ Migration v3: Ajout de la priorité des chantiers
✅ Toutes les migrations ont été appliquées avec succès
🚀 Serveur Florizar démarré sur le port 5000
```

---

## 📁 Localisation des Données

### Mode Développement

```
backend/
├── database.sqlite          ← Votre base de données
├── uploads/                 ← Vos photos
└── database_backup_vX.sqlite ← Sauvegardes auto (migrations)
```

### Mode Docker

```
data/
├── database.sqlite          ← Votre base de données
└── uploads/                 ← Vos photos
```

**Ces dossiers sont EXCLUS de Git** (via .gitignore)

---

## 🔐 Protection des Données

### .gitignore configuré

```gitignore
# Données utilisateur (JAMAIS commitées)
database.sqlite
uploads/
data/database.sqlite
data/uploads/*
backend/uploads/
*.log
```

### Volumes Docker persistants

```yaml
volumes:
  - ./data/database.sqlite:/app/database.sqlite
  - ./data/uploads:/app/uploads
```

**→ Les données restent sur votre disque, pas dans les conteneurs**

---

## 🆘 En Cas de Problème

### La migration échoue

1. **Restauration automatique** : Le système restaure la sauvegarde
2. **Logs détaillés** : Vérifiez les logs pour comprendre l'erreur
3. **Restauration manuelle** si nécessaire :

**Windows :**
```batch
RESTORE.bat
```

**Linux / macOS :**
```bash
./RESTORE.sh
```

### Perte de données accidentelle

1. Utilisez `RESTORE.bat` / `RESTORE.sh`
2. Sélectionnez la sauvegarde à restaurer
3. Vos données sont restaurées

---

## 💡 Bonnes Pratiques

### ✅ À FAIRE

1. **Sauvegardez régulièrement** avec BACKUP.bat / BACKUP.sh
2. **Testez sur une copie** en cas de doute
3. **Lisez les notes de version** avant de mettre à jour
4. **Conservez plusieurs sauvegardes** (rotation manuelle)

### ❌ À ÉVITER

1. **Ne supprimez pas** `database.sqlite` ou `uploads/`
2. **Ne modifiez pas** le schéma manuellement
3. **N'utilisez pas** `make clean` en production (efface les données Docker)
4. **Ne commitez pas** vos données dans Git

---

## 📅 Rotation des Sauvegardes

**Automatique lors des migrations :**
- Une sauvegarde est créée avant chaque migration
- Supprimée automatiquement si la migration réussit
- Conservée en cas d'échec

**Manuelles (recommandées) :**
```bash
# Créer une sauvegarde
./BACKUP.sh

# Les sauvegardes sont dans le dossier backups/
# Format : florizar_backup_YYYYMMDD_HHMMSS.tar.gz
# Conservez les 3-5 dernières sauvegardes
```

---

## 🔄 Scénarios de Mise à Jour

### Mise à jour mineure (correctifs)

```bash
git pull
npm install  # dans backend/ et frontend/
./START.sh   # ou START.bat
```

**→ Aucune migration, démarrage immédiat**

### Mise à jour majeure (nouvelles fonctionnalités)

```bash
# 1. Sauvegarder
./BACKUP.sh

# 2. Récupérer la mise à jour
git pull

# 3. Mettre à jour les dépendances
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 4. Démarrer (migrations automatiques)
./START.sh
```

**→ Les migrations s'exécutent automatiquement au démarrage**

### Docker : Mise à jour complète

```bash
# 1. Sauvegarder (optionnel, les volumes persistent)
./BACKUP.sh

# 2. Arrêter
docker-compose down

# 3. Récupérer la mise à jour
git pull

# 4. Reconstruire et démarrer
docker-compose up -d --build
```

**→ Les volumes Docker conservent vos données**

---

## 📊 Vérifier la Version de la BDD

Le serveur affiche la version au démarrage :

```
📊 Version actuelle de la BDD: v3
✅ Base de données à jour (aucune migration en attente)
```

---

## 🛠️ Pour les Développeurs

### Créer une nouvelle migration

Éditez `backend/src/config/migrations.js` :

```javascript
{
  version: 4,
  name: 'add_feature_xyz',
  up: () => {
    db.exec(`
      ALTER TABLE clients ADD COLUMN nouvelle_colonne TEXT;
    `);
    console.log('✅ Migration v4: Description');
  }
},
```

### Tester une migration

1. Créez une copie de la BDD
2. Ajoutez votre migration dans le code
3. Redémarrez le serveur
4. Vérifiez les logs

---

## ✅ Checklist Mise à Jour

- [ ] Sauvegarder avec BACKUP.bat / BACKUP.sh
- [ ] Lire les notes de version
- [ ] Récupérer les mises à jour (git pull)
- [ ] Mettre à jour les dépendances (npm install)
- [ ] Redémarrer l'application
- [ ] Vérifier que tout fonctionne
- [ ] Conserver la sauvegarde quelques jours

---

**Vos données sont précieuses et protégées ! 🛡️**
