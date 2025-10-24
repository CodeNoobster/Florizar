# 🚀 Démarrage Rapide Florizar

## ⚡ Pour tester l'application en 1 clic

### Windows

**Double-cliquez sur :**
- `START.bat` - Mode développement (recommandé pour test)
- `START-DOCKER.bat` - Mode Docker (production)

**Pour arrêter :**
- `STOP.bat` ou fermez les fenêtres
- `STOP-DOCKER.bat`

---

### Linux / macOS

**Dans le terminal :**

```bash
# Mode développement (recommandé pour test)
./START.sh

# OU Mode Docker (production)
./START-DOCKER.sh
```

**Pour arrêter :**
```bash
# Ctrl+C dans le terminal
# OU
./STOP.sh
./STOP-DOCKER.sh
```

---

### Universel (Python)

**Fonctionne sur tous les systèmes :**

```bash
# Windows
python start.py

# Linux/Mac
python3 start.py
```

---

## 📋 Prérequis

### Mode Développement (START.bat / START.sh / start.py)

**Installer uniquement :**
- [Node.js 18+](https://nodejs.org/) (inclut npm)

**C'est tout !** Le script installe automatiquement les dépendances.

### Mode Docker (START-DOCKER.*)

**Installer uniquement :**
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## 🎯 Que fait le script ?

1. ✅ Vérifie que Node.js/Docker est installé
2. ✅ Installe les dépendances si nécessaire
3. ✅ Démarre le backend (API)
4. ✅ Démarre le frontend (Interface)
5. ✅ Ouvre automatiquement votre navigateur
6. ✅ Affiche les URLs et les logs

---

## 🌐 Accéder à l'application

Une fois démarré :

**Mode Développement :**
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000

**Mode Docker :**
- Application complète : http://localhost

---

## 📝 Première utilisation

1. **Démarrez l'application** avec un des scripts ci-dessus
2. Le navigateur s'ouvre automatiquement
3. **Créez un compte** (cliquez sur "S'inscrire")
4. **Connectez-vous** avec vos identifiants
5. **Profitez !** 🎉

---

## 🐛 Problèmes courants

### "Node.js n'est pas installé"
➜ Téléchargez et installez [Node.js](https://nodejs.org/)

### "Docker n'est pas installé"
➜ Téléchargez et installez [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Port 3000 ou 5000 déjà utilisé
➜ Arrêtez les autres applications utilisant ces ports
➜ Ou modifiez les ports dans les fichiers de configuration

### Le navigateur ne s'ouvre pas
➜ Ouvrez manuellement http://localhost:3000 (dev) ou http://localhost (Docker)

### "Permission denied" sur Linux/Mac
➜ Rendez le script exécutable :
```bash
chmod +x START.sh
./START.sh
```

---

## 📊 Voir les logs

### Mode Développement

**Windows :** Les logs s'affichent dans les fenêtres séparées

**Linux/Mac :** Les logs sont dans :
- `backend.log`
- `frontend.log`

### Mode Docker

```bash
# Tous les logs
docker-compose logs -f

# Backend uniquement
docker-compose logs -f backend

# Frontend uniquement
docker-compose logs -f frontend
```

---

## 💡 Conseils

### Pour tester et itérer rapidement

✅ **Utilisez le mode développement** (START.bat / START.sh)
- Les changements de code se rechargent automatiquement
- Logs en temps réel
- Démarrage plus rapide

### Pour un environnement proche de la production

✅ **Utilisez le mode Docker** (START-DOCKER.*)
- Environnement isolé
- Configuration production
- Facile à déployer

---

## 🔄 Redémarrer après modification du code

### Mode Développement
- Les changements sont **automatiquement** détectés
- Pas besoin de redémarrer !

### Mode Docker
```bash
# Arrêter
docker-compose down

# Reconstruire et redémarrer
docker-compose up -d --build
```

---

## 📚 Plus d'informations

Consultez le [README.md](README.md) complet pour :
- Documentation détaillée
- Configuration avancée
- API endpoints
- Architecture du projet

---

**Bon test ! 🌿**
