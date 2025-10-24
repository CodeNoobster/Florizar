#!/bin/bash

# Couleurs
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}"
echo "========================================"
echo "  FLORIZAR - Arrêt Docker"
echo "========================================"
echo -e "${NC}"

docker-compose down

echo ""
echo -e "${GREEN}========================================"
echo "  FLORIZAR ARRÊTÉ (Docker) !"
echo "========================================${NC}"
echo ""
