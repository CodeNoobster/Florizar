#!/bin/bash

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}"
echo "========================================"
echo "  FLORIZAR - Arrêt des services"
echo "========================================"
echo -e "${NC}"

# Arrêter les services via les PIDs
if [ -f .backend.pid ]; then
    echo -e "${GREEN}[*]${NC} Arrêt du Backend..."
    kill $(cat .backend.pid) 2>/dev/null
    rm .backend.pid
fi

if [ -f .frontend.pid ]; then
    echo -e "${GREEN}[*]${NC} Arrêt du Frontend..."
    kill $(cat .frontend.pid) 2>/dev/null
    rm .frontend.pid
fi

if [ -f .florizar.pid ]; then
    rm .florizar.pid
fi

# Alternative : tuer tous les processus node (si les PIDs ne fonctionnent pas)
echo -e "${GREEN}[*]${NC} Nettoyage des processus Node.js..."
pkill -f "node.*backend" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo ""
echo -e "${GREEN}========================================"
echo "  FLORIZAR ARRÊTÉ !"
echo "========================================${NC}"
echo ""
