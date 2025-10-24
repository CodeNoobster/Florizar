#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

clear

echo -e "${BLUE}"
echo "========================================"
echo "  FLORIZAR - Sauvegarde des données"
echo "========================================"
echo -e "${NC}"

# Créer le dossier de backup s'il n'existe pas
mkdir -p backups

# Créer un nom de fichier avec la date
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/florizar_backup_${TIMESTAMP}.tar.gz"

echo -e "${GREEN}[*]${NC} Création de la sauvegarde..."
echo ""

# Créer la sauvegarde
tar -czf "$BACKUP_FILE" \
    backend/database.sqlite \
    backend/uploads/ \
    data/database.sqlite \
    data/uploads/ \
    2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERREUR]${NC} La sauvegarde a échoué !"
    exit 1
fi

# Calculer la taille
SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo ""
echo -e "${GREEN}========================================"
echo "  SAUVEGARDE RÉUSSIE !"
echo "========================================${NC}"
echo ""
echo "  Fichier : $BACKUP_FILE"
echo "  Taille  : $SIZE"
echo ""
echo "  Contenu :"
echo "  - Base de données SQLite"
echo "  - Photos uploadées"
echo ""
echo "  Pour restaurer : ./RESTORE.sh"
echo ""
echo "========================================"
echo ""

# Lister les sauvegardes existantes
echo "Sauvegardes disponibles :"
echo ""
ls -lh backups/*.tar.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
echo ""
