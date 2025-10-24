#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

clear

echo -e "${YELLOW}"
echo "========================================"
echo "  FLORIZAR - Restauration des données"
echo "========================================"
echo -e "${NC}"

# Vérifier si des sauvegardes existent
if [ ! -d "backups" ] || [ -z "$(ls -A backups/*.tar.gz 2>/dev/null)" ]; then
    echo -e "${RED}[ERREUR]${NC} Aucune sauvegarde trouvée !"
    echo ""
    echo "Exécutez d'abord ./BACKUP.sh"
    exit 1
fi

# Lister les sauvegardes disponibles
echo "Sauvegardes disponibles :"
echo ""
ls -lh backups/*.tar.gz 2>/dev/null | awk '{print "  " NR ". " $9 " (" $5 ")"}'
echo ""

# Demander quelle sauvegarde restaurer
read -p "Entrez le numéro ou le nom du fichier de sauvegarde : " BACKUP_CHOICE

# Si c'est un numéro, récupérer le nom du fichier
if [[ "$BACKUP_CHOICE" =~ ^[0-9]+$ ]]; then
    BACKUP_FILE=$(ls backups/*.tar.gz 2>/dev/null | sed -n "${BACKUP_CHOICE}p")
else
    if [[ "$BACKUP_CHOICE" != backups/* ]]; then
        BACKUP_FILE="backups/$BACKUP_CHOICE"
    else
        BACKUP_FILE="$BACKUP_CHOICE"
    fi
fi

# Vérifier que le fichier existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}[ERREUR]${NC} Fichier non trouvé : $BACKUP_FILE"
    exit 1
fi

echo ""
echo -e "${RED}========================================"
echo "  ATTENTION !"
echo "========================================${NC}"
echo ""
echo "  Cette opération va REMPLACER :"
echo "  - La base de données actuelle"
echo "  - Les photos actuelles"
echo ""
echo "  Les données actuelles seront PERDUES !"
echo ""
read -p "Voulez-vous continuer ? (oui/non) : " CONFIRM

if [ "$CONFIRM" != "oui" ]; then
    echo ""
    echo -e "${YELLOW}[*]${NC} Restauration annulée"
    exit 0
fi

echo ""
echo -e "${GREEN}[*]${NC} Restauration en cours..."

# Extraire la sauvegarde
tar -xzf "$BACKUP_FILE"

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERREUR]${NC} La restauration a échoué !"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================"
echo "  RESTAURATION RÉUSSIE !"
echo "========================================${NC}"
echo ""
echo "  Les données ont été restaurées."
echo ""
