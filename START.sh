#!/bin/bash

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear

echo -e "${GREEN}"
echo "========================================"
echo "  FLORIZAR - Démarrage automatique"
echo "========================================"
echo -e "${NC}"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERREUR]${NC} Node.js n'est pas installé !"
    echo ""
    echo "Installez Node.js : https://nodejs.org/"
    echo ""
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Node.js détecté : $(node --version)"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[ERREUR]${NC} npm n'est pas installé !"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} npm détecté : $(npm --version)"
echo ""

# Installer les dépendances backend si nécessaire
if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}========================================"
    echo "  Installation Backend..."
    echo "========================================${NC}"
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERREUR]${NC} Installation backend échouée !"
        exit 1
    fi
    cd ..
    echo -e "${GREEN}[OK]${NC} Backend installé"
    echo ""
fi

# Installer les dépendances frontend si nécessaire
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}========================================"
    echo "  Installation Frontend..."
    echo "========================================${NC}"
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERREUR]${NC} Installation frontend échouée !"
        exit 1
    fi
    cd ..
    echo -e "${GREEN}[OK]${NC} Frontend installé"
    echo ""
fi

echo -e "${BLUE}========================================"
echo "  Démarrage des services..."
echo "========================================${NC}"
echo ""

# Créer un fichier pour stocker les PIDs
echo $$ > .florizar.pid

# Fonction de nettoyage
cleanup() {
    echo ""
    echo -e "${YELLOW}[*] Arrêt des services...${NC}"
    if [ -f .backend.pid ]; then
        kill $(cat .backend.pid) 2>/dev/null
        rm .backend.pid
    fi
    if [ -f .frontend.pid ]; then
        kill $(cat .frontend.pid) 2>/dev/null
        rm .frontend.pid
    fi
    rm .florizar.pid 2>/dev/null
    echo -e "${GREEN}[OK] Services arrêtés${NC}"
    exit 0
}

# Capturer Ctrl+C
trap cleanup INT TERM

# Démarrer le backend en arrière-plan
echo -e "${GREEN}[*]${NC} Démarrage du Backend (port 5000)..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../.backend.pid
cd ..

# Attendre 3 secondes
sleep 3

# Démarrer le frontend en arrière-plan
echo -e "${GREEN}[*]${NC} Démarrage du Frontend (port 3000)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../.frontend.pid
cd ..

# Attendre 5 secondes
sleep 5

# Ouvrir le navigateur
echo -e "${GREEN}[*]${NC} Ouverture du navigateur..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 &> /dev/null &
elif command -v open &> /dev/null; then
    open http://localhost:3000 &> /dev/null &
fi

echo ""
echo -e "${GREEN}========================================"
echo "  FLORIZAR DÉMARRÉ !"
echo "========================================${NC}"
echo ""
echo "  Backend  : http://localhost:5000"
echo "  Frontend : http://localhost:3000"
echo ""
echo "  Logs Backend  : backend.log"
echo "  Logs Frontend : frontend.log"
echo ""
echo -e "${YELLOW}  Appuyez sur Ctrl+C pour arrêter${NC}"
echo ""
echo "========================================"
echo ""

# Garder le script actif
wait
