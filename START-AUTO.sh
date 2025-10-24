#!/bin/bash
# ============================================
# Script de démarrage automatique de Florizar
# Lance le backend, vérifie qu'il tourne, puis lance le frontend
# ============================================

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "========================================"
echo "   DEMARRAGE AUTOMATIQUE FLORIZAR"
echo "========================================"
echo ""

# Fonction pour afficher les succès
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}✗ ERREUR: $1${NC}"
    exit 1
}

# Fonction pour afficher les informations
info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

echo "[0/8] Nettoyage des processus existants..."

# Fermer tous les processus Node.js et npm existants
echo "Fermeture de tous les processus Node.js et npm..."

# Tuer les processus node (ignorer les erreurs si aucun processus trouvé)
pkill -f "node src/server.js" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
killall node 2>/dev/null || true
killall npm 2>/dev/null || true

# Attendre que les processus se terminent complètement
sleep 2

success "Nettoyage terminé"

# À partir d'ici, activer la sortie en cas d'erreur
set -e

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Installez-le depuis https://nodejs.org/"
fi

echo "[1/8] Vérification des dépendances..."

# Vérifier si les dépendances sont installées
NEED_INSTALL=0

if [ ! -d "backend/node_modules" ]; then
    info "Dépendances backend manquantes"
    NEED_INSTALL=1
fi

if [ ! -d "frontend/node_modules" ]; then
    info "Dépendances frontend manquantes"
    NEED_INSTALL=1
fi

if [ ! -f "backend/.env" ]; then
    info "Fichier .env manquant"
    NEED_INSTALL=1
fi

if [ $NEED_INSTALL -eq 1 ]; then
    echo ""
    echo "========================================"
    echo "   INSTALLATION DES DEPENDANCES"
    echo "========================================"
    echo ""

    echo "[2/8] Installation des dépendances backend..."
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        error "Installation backend échouée"
    fi
    cd ..

    echo "[3/8] Installation des dépendances frontend..."
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        error "Installation frontend échouée"
    fi
    cd ..

    echo "[4/8] Configuration de l'environnement..."
    cd backend
    if [ ! -f ".env" ]; then
        cp .env.example .env 2>/dev/null

        # Générer un JWT_SECRET sécurisé
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

        # Remplacer JWT_SECRET dans .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
        else
            # Linux
            sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
        fi

        success "Fichier .env créé avec JWT_SECRET sécurisé"
    fi
    cd ..

    # Créer les dossiers nécessaires
    mkdir -p backend/uploads
    mkdir -p data/uploads
    mkdir -p backups

    echo ""
    echo "========================================"
    echo "   INSTALLATION TERMINEE !"
    echo "========================================"
    echo ""
else
    success "Toutes les dépendances sont installées"
fi

# Fonction pour libérer un port
kill_port() {
    local port=$1
    local port_name=$2

    echo "[$3] Vérification et libération du port $port ($port_name)..."

    # Essayer avec lsof (plus portable)
    if command -v lsof &> /dev/null; then
        local pid=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            info "Port $port occupé par PID $pid - Libération en cours..."
            kill -9 $pid 2>/dev/null
            sleep 1
        fi
    # Fallback avec fuser
    elif command -v fuser &> /dev/null; then
        fuser -k ${port}/tcp 2>/dev/null
        sleep 1
    # Fallback avec netstat
    else
        local pid=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1)
        if [ ! -z "$pid" ]; then
            info "Port $port occupé par PID $pid - Libération en cours..."
            kill -9 $pid 2>/dev/null
            sleep 1
        fi
    fi

    success "Port $port libre"
}

# Libérer les ports avant de démarrer
kill_port 5000 "backend" "5/8"
kill_port 5173 "frontend" "6/8"

echo "[7/8] Démarrage du backend..."
cd backend

# Démarrer le backend en arrière-plan
nohup node src/server.js > backend.log 2>&1 &
BACKEND_PID=$!

info "Backend démarré avec PID: $BACKEND_PID"

echo "Attente du backend (vérification du port 5000)..."

# Attendre que le backend soit prêt (max 30 secondes)
counter=0
max_attempts=15

while [ $counter -lt $max_attempts ]; do
    sleep 2

    # Vérifier si le port 5000 est ouvert
    if nc -z localhost 5000 2>/dev/null || (exec 3<>/dev/tcp/localhost/5000) 2>/dev/null; then
        success "Backend démarré avec succès !"
        break
    fi

    counter=$((counter + 1))
    info "Attente... tentative $counter/$max_attempts"

    # Vérifier si le processus backend est toujours en cours
    if ! ps -p $BACKEND_PID > /dev/null; then
        error "Le backend s'est arrêté. Vérifiez backend/backend.log pour plus de détails"
    fi
done

if [ $counter -eq $max_attempts ]; then
    error "Le backend n'a pas démarré après 30 secondes. Vérifiez backend/backend.log"
fi

cd ..

echo "[8/8] Démarrage du frontend..."
cd frontend

# Démarrer le frontend dans un nouveau terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && npm run dev"'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - essayer différents terminaux
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "npm run dev; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "npm run dev" &
    elif command -v konsole &> /dev/null; then
        konsole -e "npm run dev" &
    else
        info "Terminal graphique non détecté. Lancement en arrière-plan..."
        nohup npm run dev > frontend.log 2>&1 &
    fi
else
    # Autre système - lancer en arrière-plan
    nohup npm run dev > frontend.log 2>&1 &
fi

cd ..

echo ""
echo "Florizar démarré !"
echo ""
echo "========================================"
echo "  APPLICATION DEMARREE AVEC SUCCES"
echo "========================================"
echo ""
echo -e "${GREEN}Backend:  http://localhost:5000${NC}"
echo -e "${GREEN}Frontend: http://localhost:5173${NC}"
echo ""
echo "Pour arrêter l'application:"
echo "  - Fermez les fenêtres de terminal"
echo "  - Ou utilisez: pkill -f 'node src/server.js'"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Les logs backend sont dans: backend/backend.log"
echo ""

# Sauvegarder le PID pour pouvoir arrêter plus tard
echo $BACKEND_PID > .backend.pid

info "Pour arrêter le backend: kill \$(cat .backend.pid)"
echo ""
