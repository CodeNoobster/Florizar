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

Après l'installation, vous avez **3 options** :

### Option A : Démarrage Automatique (⭐ RECOMMANDÉ)

Lance le backend, vérifie qu'il fonctionne, puis démarre le frontend automatiquement.

**Windows :**
```
START-AUTO.bat
```

**Linux/Mac :**
```bash
./START-AUTO.sh
```

✅ **Avantages** :
- Séquence de démarrage optimisée
- Vérification automatique du backend avant de lancer le frontend
- Pas besoin de gérer plusieurs fenêtres
- Logs accessibles dans `backend/backend.log`

➡️ L'application sera accessible sur : **http://localhost:5173**

### Option B : Démarrage Manuel (2 fenêtres séparées)

Ouvre 2 fenêtres : une pour le backend, une pour le frontend.

**Windows :**
```
START.bat
```

**Linux/Mac :**
```bash
./START.sh
```

➡️ L'application sera accessible sur : **http://localhost:5173**

### Option C : Mode Docker (pour production)

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

## 🛑 Arrêter l'Application

**Windows :**
```
STOP.bat
```

**Linux/Mac :**
```bash
./STOP.sh
```

Ou fermez simplement les fenêtres de terminal/cmd.

---

## 🔐 Première Connexion

Après le démarrage, l'application s'ouvre sur la page de connexion.

### Créer votre premier compte

1. Cliquez sur **"Pas encore de compte ? S'inscrire"** en bas de la page
2. Remplissez le formulaire d'inscription :
   - **Nom d'utilisateur** : 3-30 caractères (lettres, chiffres, tirets, underscores)
   - **Email** : votre adresse email valide
   - **Mot de passe** : minimum 8 caractères avec :
     - Au moins une majuscule
     - Au moins une minuscule
     - Au moins un chiffre
     - Au moins un caractère spécial (@$!%*?&)
3. Cliquez sur **"S'inscrire"**
4. Vous serez redirigé vers la page de connexion
5. Connectez-vous avec vos identifiants

**Exemple de mot de passe valide** : `Florizar2024!`

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
4. Lancer START-AUTO.bat (ou ./START-AUTO.sh) ⭐
   ↓
5. Ouvrir http://localhost:5173 dans votre navigateur
   ↓
6. S'inscrire avec un compte sécurisé
   ↓
7. Commencer à utiliser Florizar ! 🌿
```

---

## ✨ C'est Tout !

Votre application Florizar est maintenant **100% opérationnelle** !

Pour toute question ou problème :
1. Consultez [DEMARRAGE-RAPIDE.md](./DEMARRAGE-RAPIDE.md)
2. Vérifiez [SECURITE.md](./SECURITE.md)
3. Créez une issue sur GitHub

**Bon jardinage avec Florizar ! 🌿🚀**
