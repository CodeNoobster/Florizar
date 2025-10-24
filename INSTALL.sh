#!/bin/bash
# ============================================
# Script d'installation initiale de Florizar
# Configure automatiquement le projet
# ============================================

set -e  # Arrêter en cas d'erreur

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "========================================"
echo "    INSTALLATION FLORIZAR"
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

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Installez-le depuis https://nodejs.org/ ou avec votre gestionnaire de paquets (apt, brew, etc.)"
fi

echo "[1/6] Vérification de Node.js..."
NODE_VERSION=$(node --version)
success "Node.js détecté: $NODE_VERSION"
echo ""

echo "[2/6] Installation des dépendances backend..."
cd backend
if npm install; then
    success "Backend installé avec succès !"
else
    error "Échec de l'installation des dépendances backend"
fi
cd ..
echo ""

echo "[3/6] Installation des dépendances frontend..."
cd frontend
if npm install; then
    success "Frontend installé avec succès !"
else
    error "Échec de l'installation des dépendances frontend"
fi
cd ..
echo ""

echo "[4/6] Configuration de l'environnement..."
cd backend

# Vérifier si .env existe déjà
if [ -f .env ]; then
    warning "Le fichier .env existe déjà."
    read -p "Voulez-vous le remplacer ? (o/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[OoYy]$ ]]; then
        info "Configuration .env conservée"
        cd ..
        goto_skip_env=true
    else
        goto_skip_env=false
    fi
else
    goto_skip_env=false
fi

if [ "$goto_skip_env" = false ]; then
    # Copier .env.example vers .env
    cp .env.example .env
    success "Fichier .env créé avec succès !"
    echo ""

    echo "[5/6] Génération d'un JWT_SECRET sécurisé..."

    # Générer un JWT_SECRET aléatoire
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

    # Remplacer la ligne JWT_SECRET dans .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    else
        # Linux
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    fi

    success "JWT_SECRET généré et configuré automatiquement !"
    info "JWT_SECRET: ${JWT_SECRET:0:16}... (tronqué pour sécurité)"
    echo ""
else
    echo "[5/6] Configuration JWT_SECRET ignorée (fichier existant conservé)"
    echo ""
fi

cd ..

echo "[6/6] Création des dossiers nécessaires..."
mkdir -p backend/uploads
mkdir -p data
mkdir -p data/uploads
mkdir -p backups
success "Dossiers créés avec succès !"
echo ""

echo "========================================"
echo -e "${GREEN}  INSTALLATION TERMINÉE AVEC SUCCÈS !${NC}"
echo "========================================"
echo ""
echo "Votre application Florizar est prête à être utilisée."
echo ""
echo "Configuration effectuée:"
echo "  ✓ Dépendances backend installées"
echo "  ✓ Dépendances frontend installées"
echo "  ✓ Fichier .env configuré avec JWT_SECRET sécurisé"
echo "  ✓ Dossiers créés (uploads, data, backups)"
echo ""
echo "Prochaines étapes:"
echo ""
echo "1. MODE DÉVELOPPEMENT (recommandé pour tests):"
echo "   ./START.sh"
echo "   L'application sera accessible sur http://localhost:3000"
echo ""
echo "2. MODE DOCKER (pour production):"
echo "   ./START-DOCKER.sh"
echo "   L'application sera accessible sur http://localhost"
echo ""

read -p "Voulez-vous démarrer l'application maintenant ? (o/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[OoYy]$ ]]; then
    echo ""
    echo "Démarrage de l'application en mode développement..."
    echo ""
    ./START.sh
else
    echo ""
    echo "Pour démarrer plus tard, lancez ./START.sh"
fi

echo ""
