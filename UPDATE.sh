#!/bin/bash
# ============================================
# Script de mise à jour automatique Florizar
# Avec sauvegarde et migration de données
# ============================================

set -e  # Arrêter en cas d'erreur

echo ""
echo "========================================"
echo "    MISE À JOUR FLORIZAR"
echo "========================================"
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}ERREUR: $1${NC}"
    exit 1
}

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}ATTENTION: $1${NC}"
}

# Fonction pour afficher les succès
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    error "Git n'est pas installé. Installez-le avec: sudo apt install git (Ubuntu/Debian) ou brew install git (Mac)"
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Installez-le depuis https://nodejs.org/"
fi

echo "[1/7] Vérification de l'environnement..."
echo ""

# Vérifier qu'on est dans un dépôt Git
if ! git status &> /dev/null; then
    error "Ce dossier n'est pas un dépôt Git"
fi

success "Environnement validé"

echo ""
echo "[2/7] Création de la sauvegarde avant mise à jour..."
echo ""

# Créer une sauvegarde avant la mise à jour
if [ -f "BACKUP.sh" ]; then
    if bash BACKUP.sh; then
        success "Sauvegarde créée avec succès"
    else
        error "Échec de la sauvegarde. La mise à jour est annulée pour protéger vos données"
    fi
else
    warning "Script BACKUP.sh non trouvé"
    echo "Sauvegarde manuelle recommandée avant de continuer"
    read -p "Continuer quand même ? (o/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        echo "Mise à jour annulée"
        exit 1
    fi
fi

echo ""
echo "[3/7] Récupération des mises à jour depuis Git..."
echo ""

# Sauvegarder la branche actuelle
CURRENT_BRANCH=$(git branch --show-current)
echo "Branche actuelle: $CURRENT_BRANCH"

# Récupérer les mises à jour
if ! git fetch origin; then
    error "Impossible de récupérer les mises à jour"
fi

# Vérifier s'il y a des modifications locales non commitées
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo ""
    warning "Vous avez des modifications non sauvegardées"
    git status --short
    echo ""
    read -p "Voulez-vous les mettre de côté temporairement ? (o/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        git stash push -m "Sauvegarde automatique avant mise à jour"
        STASHED=1
    else
        echo "Mise à jour annulée"
        exit 1
    fi
fi

# Effectuer le pull
echo "Mise à jour du code..."
if ! git pull origin "$CURRENT_BRANCH"; then
    error "Échec de la mise à jour Git"
fi

success "Code mis à jour"

echo ""
echo "[4/7] Mise à jour des dépendances backend..."
echo ""

cd backend
if npm install; then
    success "Dépendances backend installées"
else
    error "Échec de l'installation des dépendances backend"
fi
cd ..

echo ""
echo "[5/7] Mise à jour des dépendances frontend..."
echo ""

cd frontend
if npm install; then
    success "Dépendances frontend installées"
else
    error "Échec de l'installation des dépendances frontend"
fi
cd ..

echo ""
echo "[6/7] Vérification de la sécurité (npm audit)..."
echo ""

cd backend
echo "Audit de sécurité backend..."
if npm audit --audit-level=high; then
    success "Aucune vulnérabilité haute/critique détectée"
else
    echo ""
    warning "Des vulnérabilités de sécurité ont été détectées"
    echo "Il est recommandé de les corriger"
    read -p "Voulez-vous tenter de les corriger automatiquement ? (o/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        npm audit fix
    fi
fi
cd ..

cd frontend
echo "Audit de sécurité frontend..."
if npm audit --audit-level=high; then
    success "Aucune vulnérabilité haute/critique détectée"
else
    echo ""
    warning "Des vulnérabilités de sécurité ont été détectées"
    read -p "Voulez-vous tenter de les corriger automatiquement ? (o/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        npm audit fix
    fi
fi
cd ..

echo ""
echo "[7/7] Migration de la base de données..."
echo ""

echo "Les migrations seront exécutées automatiquement au prochain démarrage"
echo "du serveur. Si une erreur se produit, une sauvegarde sera restaurée."
echo ""

# Restaurer les modifications si elles avaient été mises de côté
if [ -n "$STASHED" ]; then
    echo "Restauration de vos modifications locales..."
    git stash pop
fi

echo ""
echo "========================================"
echo -e "${GREEN}  MISE À JOUR TERMINÉE AVEC SUCCÈS${NC}"
echo "========================================"
echo ""
echo "Prochaines étapes:"
echo "1. Vérifiez le fichier CHANGELOG.md pour les nouveautés"
echo "2. Lancez l'application avec ./START.sh ou ./START-DOCKER.sh"
echo "3. Les migrations de base de données s'exécuteront automatiquement"
echo ""
echo "Une sauvegarde a été créée dans le dossier backups/"
echo "En cas de problème, utilisez ./RESTORE.sh"
echo ""
