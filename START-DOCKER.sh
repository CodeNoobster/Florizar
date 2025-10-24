#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

clear

echo -e "${GREEN}"
echo "========================================"
echo "  FLORIZAR - Démarrage Docker"
echo "========================================"
echo -e "${NC}"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERREUR]${NC} Docker n'est pas installé !"
    echo ""
    echo "Installez Docker : https://docs.docker.com/get-docker/"
    echo ""
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Docker détecté : $(docker --version)"

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}[ERREUR]${NC} Docker Compose n'est pas installé !"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Docker Compose détecté : $(docker-compose --version)"
echo ""

echo -e "${BLUE}========================================"
echo "  Construction des images..."
echo "========================================${NC}"
echo ""

docker-compose build
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERREUR]${NC} Build échoué !"
    exit 1
fi

echo ""
echo -e "${BLUE}========================================"
echo "  Démarrage des conteneurs..."
echo "========================================${NC}"
echo ""

docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERREUR]${NC} Démarrage échoué !"
    exit 1
fi

# Attendre 10 secondes
sleep 10

# Ouvrir le navigateur
echo -e "${GREEN}[*]${NC} Ouverture du navigateur..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost &> /dev/null &
elif command -v open &> /dev/null; then
    open http://localhost &> /dev/null &
fi

echo ""
echo -e "${GREEN}========================================"
echo "  FLORIZAR DÉMARRÉ (Docker) !"
echo "========================================${NC}"
echo ""
echo "  Application : http://localhost"
echo ""
echo "  Voir les logs :"
echo "    docker-compose logs -f"
echo ""
echo "  Arrêter :"
echo "    docker-compose down"
echo "    ou ./STOP-DOCKER.sh"
echo ""
echo "========================================"
echo ""
