# 📜 Guide des Scripts Florizar (Windows)

Ce projet contient plusieurs scripts Windows (.bat) pour faciliter l'utilisation. Voici un guide complet.

---

## 🚀 Scripts de Démarrage

### **START-AUTO.bat** ⭐ RECOMMANDÉ

**Utilisation** : Premier démarrage et utilisation quotidienne

**Ce qu'il fait** :
1. Ferme automatiquement tous les anciens processus Node.js
2. Vérifie si les dépendances sont installées
3. Installe automatiquement si nécessaire (npm install backend + frontend)
4. Libère les ports 5000 et 5173
5. Démarre le backend et attend qu'il soit prêt
6. Démarre le frontend
7. Affiche les erreurs clairement dans des fenêtres séparées

**Avantages** :
- ✅ Tout automatique, aucune action requise
- ✅ Gère l'installation des dépendances manquantes
- ✅ Nettoie les anciens processus
- ✅ Vérifie que tout fonctionne avant de continuer
- ✅ Affiche les erreurs visibles

**Comment lancer** :
```
Double-clic sur START-AUTO.bat
```

---

### **START.bat**

**Utilisation** : Si vous préférez 2 fenêtres séparées

**Ce qu'il fait** :
- Ouvre 2 fenêtres CMD :
  - Fenêtre 1 : Backend (port 5000)
  - Fenêtre 2 : Frontend (port 5173)

**Avantages** :
- ✅ Contrôle visuel séparé du backend et frontend
- ✅ Peut redémarrer backend ou frontend indépendamment

**Inconvénients** :
- ❌ Ne vérifie PAS les dépendances
- ❌ Ne nettoie PAS les anciens processus
- ❌ Vous devez gérer 2 fenêtres

**Comment lancer** :
```
Double-clic sur START.bat
```

---

### **START-DOCKER.bat**

**Utilisation** : Mode production avec Docker

**Ce qu'il fait** :
- Lance l'application avec Docker Compose
- Crée des conteneurs isolés pour backend et frontend

**Prérequis** :
- Docker Desktop installé

**Comment lancer** :
```
Double-clic sur START-DOCKER.bat
```

---

## 🛑 Scripts d'Arrêt

### **STOP.bat**

**Ce qu'il fait** :
- Ferme toutes les fenêtres "Florizar Backend" et "Florizar Frontend"
- Tue tous les processus node.exe

**Comment lancer** :
```
Double-clic sur STOP.bat
```

**Ou** : Fermez simplement les fenêtres CMD du backend et frontend

---

### **STOP-DOCKER.bat**

**Ce qu'il fait** :
- Arrête les conteneurs Docker
- Nettoie les ressources Docker

**Comment lancer** :
```
Double-clic sur STOP-DOCKER.bat
```

---

## 📦 Scripts d'Installation et Mise à Jour

### **INSTALL.bat**

**Utilisation** : Première installation du projet

**Ce qu'il fait** :
1. Installe les dépendances backend (`npm install` dans backend/)
2. Installe les dépendances frontend (`npm install` dans frontend/)
3. Crée le fichier `.env` avec un JWT_SECRET sécurisé
4. Crée les dossiers nécessaires (uploads, data, backups)
5. Propose de démarrer l'application immédiatement

**Quand l'utiliser** :
- ✅ Après avoir téléchargé le projet depuis GitHub
- ✅ Si vous avez supprimé les dossiers node_modules

**Comment lancer** :
```
Double-clic sur INSTALL.bat
```

**Note** : START-AUTO.bat fait la même chose automatiquement, donc INSTALL.bat n'est plus vraiment nécessaire.

---

### **UPDATE.bat**

**Utilisation** : Mise à jour du projet depuis GitHub

**Ce qu'il fait** :
1. Crée une sauvegarde automatique (avec BACKUP.bat)
2. Effectue `git pull` pour récupérer les dernières modifications
3. Met à jour les dépendances (`npm install` si nécessaire)
4. Lance `npm audit` pour vérifier les vulnérabilités
5. Applique les migrations de base de données si nécessaire

**Quand l'utiliser** :
- ✅ Quand vous voulez récupérer les dernières modifications du projet

**Comment lancer** :
```
Double-clic sur UPDATE.bat
```

---

## 💾 Scripts de Sauvegarde

### **BACKUP.bat**

**Ce qu'il fait** :
- Crée une sauvegarde complète de :
  - Base de données (`data/florizar.db`)
  - Uploads (`backend/uploads`, `data/uploads`)
  - Configuration (`.env`)
- Sauvegarde dans `backups/backup_AAAAMMJJ_HHMMSS.zip`

**Quand l'utiliser** :
- ✅ Avant une mise à jour importante
- ✅ Régulièrement pour sécuriser vos données
- ✅ Avant de modifier la structure de la base de données

**Comment lancer** :
```
Double-clic sur BACKUP.bat
```

---

### **RESTORE.bat**

**Ce qu'il fait** :
- Liste toutes les sauvegardes disponibles
- Permet de choisir laquelle restaurer
- Restaure la base de données, uploads et configuration

**Quand l'utiliser** :
- ✅ Après une erreur ou perte de données
- ✅ Pour revenir à un état antérieur

**Comment lancer** :
```
Double-clic sur RESTORE.bat
```

---

## 📊 Résumé : Quel Script Utiliser ?

| Situation | Script à Utiliser |
|-----------|-------------------|
| 🆕 Première installation | **INSTALL.bat** ou **START-AUTO.bat** |
| 🚀 Lancer l'application au quotidien | **START-AUTO.bat** ⭐ |
| 🛑 Arrêter l'application | **STOP.bat** ou fermer les fenêtres CMD |
| 🔄 Mettre à jour depuis GitHub | **UPDATE.bat** |
| 💾 Sauvegarder avant une manip | **BACKUP.bat** |
| ↩️ Restaurer une sauvegarde | **RESTORE.bat** |
| 🐳 Mode production Docker | **START-DOCKER.bat** + **STOP-DOCKER.bat** |

---

## ⚠️ Important

**Ne PAS utiliser** :
- ❌ Les fichiers commençant par `TEST-` (scripts de diagnostic temporaires)
- ❌ Plusieurs scripts de démarrage en même temps

**Recommandation** :
- ✅ Utilisez **START-AUTO.bat** pour tout
- ✅ Créez des sauvegardes régulières avec **BACKUP.bat**
- ✅ Utilisez **UPDATE.bat** pour les mises à jour

---

## 🆘 En Cas de Problème

1. **Fermez TOUT** avec **STOP.bat**
2. **Vérifiez** que les ports 5000 et 5173 sont libres
3. **Relancez** avec **START-AUTO.bat**
4. **Si ça ne marche toujours pas**, regardez les fenêtres "Florizar Backend" et "Florizar Frontend" pour voir les erreurs

---

## 📞 Support

Pour toute question, consultez :
- [README-INSTALLATION.md](README-INSTALLATION.md) - Guide d'installation détaillé
- [SECURITE.md](SECURITE.md) - Guide de sécurité
- [CHANGELOG.md](CHANGELOG.md) - Historique des versions
