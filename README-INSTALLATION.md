# 🚀 Installation Rapide de Florizar

Ce guide vous permet d'installer et configurer Florizar **en 1 clic** !

---

## 📥 Étape 1 : Télécharger le Projet

### Option A : Télécharger le ZIP (le plus simple)

1. Allez sur : **https://github.com/CodeNoobster/Florizar**
2. Cliquez sur le bouton vert **"Code"** ▼
3. Sélectionnez la branche **`claude/landscape-app-init-011CURQwEgk6y9pXrzRHjGVn`**
4. Cliquez sur **"Download ZIP"**
5. Décompressez le fichier ZIP dans le dossier de votre choix

### Option B : Cloner avec Git (recommandé)

```bash
git clone https://github.com/CodeNoobster/Florizar.git
cd Florizar
git checkout claude/landscape-app-init-011CURQwEgk6y9pXrzRHjGVn
```

---

## ⚡ Étape 2 : Installation Automatique (1 CLIC)

### Windows

1. Double-cliquez sur **`INSTALL.bat`**
2. Attendez que l'installation se termine
3. C'est tout ! ✅

### Linux / Mac

```bash
./INSTALL.sh
```

---

## 🎯 Ce que fait le script INSTALL

Le script **INSTALL** configure automatiquement **TOUT** pour vous :

✅ **Installe** les dépendances backend (Node.js packages)
✅ **Installe** les dépendances frontend (React packages)
✅ **Crée** le fichier de configuration `.env`
✅ **Génère** automatiquement un `JWT_SECRET` ultra-sécurisé
✅ **Crée** tous les dossiers nécessaires (uploads, data, backups)
✅ **Configure** l'environnement complet
✅ **Propose** de démarrer l'application directement

**Vous n'avez RIEN à faire manuellement !** 🎉

---

## 🚀 Étape 3 : Démarrer l'Application

Après l'installation, vous avez **2 choix** :

### Mode Développement (recommandé pour tests)

**Windows :**
```
START.bat
```

**Linux/Mac :**
```bash
./START.sh
```

➡️ L'application sera accessible sur : **http://localhost:3000**

### Mode Docker (pour production)

**Windows :**
```
START-DOCKER.bat
```

**Linux/Mac :**
```bash
./START-DOCKER.sh
```

➡️ L'application sera accessible sur : **http://localhost**

---

## 📋 Prérequis

Avant de lancer le script INSTALL, assurez-vous d'avoir :

### Pour le Mode Développement
- ✅ **Node.js** (version 16 ou supérieure) - [Télécharger](https://nodejs.org/)

### Pour le Mode Docker (optionnel)
- ✅ **Docker Desktop** - [Télécharger](https://www.docker.com/products/docker-desktop)

---

## ❓ Problèmes Courants

### "Node.js n'est pas installé"
➡️ Installez Node.js depuis https://nodejs.org/

### "npm : commande introuvable"
➡️ Redémarrez votre terminal après l'installation de Node.js

### "Permission denied" (Linux/Mac)
➡️ Exécutez : `chmod +x INSTALL.sh` puis `./INSTALL.sh`

### L'application ne démarre pas
➡️ Vérifiez que les ports **3000** (dev) ou **80** (docker) ne sont pas déjà utilisés

---

## 📚 Ressources

- **Guide de Démarrage Rapide** : [DEMARRAGE-RAPIDE.md](./DEMARRAGE-RAPIDE.md)
- **Guide de Sécurité** : [SECURITE.md](./SECURITE.md)
- **Guide de Mise à Jour** : [MISE-A-JOUR.md](./MISE-A-JOUR.md)
- **Changelog** : [CHANGELOG.md](./CHANGELOG.md)

---

## 🎓 Workflow Complet

```
1. Télécharger le projet (ZIP ou Git clone)
   ↓
2. Double-cliquer sur INSTALL.bat (ou ./INSTALL.sh)
   ↓
3. Attendre la fin de l'installation automatique
   ↓
4. Lancer START.bat (ou ./START.sh)
   ↓
5. Ouvrir http://localhost:3000 dans votre navigateur
   ↓
6. Commencer à utiliser Florizar ! 🌿
```

---

## ✨ C'est Tout !

Votre application Florizar est maintenant **100% opérationnelle** !

Pour toute question ou problème :
1. Consultez [DEMARRAGE-RAPIDE.md](./DEMARRAGE-RAPIDE.md)
2. Vérifiez [SECURITE.md](./SECURITE.md)
3. Créez une issue sur GitHub

**Bon jardinage avec Florizar ! 🌿🚀**
