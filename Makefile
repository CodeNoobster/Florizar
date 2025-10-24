.PHONY: help build up down restart logs clean

help: ## Afficher l'aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construire les images Docker
	docker-compose build

up: ## Démarrer l'application
	docker-compose up -d
	@echo "✅ Florizar est démarré sur http://localhost"

down: ## Arrêter l'application
	docker-compose down

restart: down up ## Redémarrer l'application

logs: ## Voir les logs
	docker-compose logs -f

logs-backend: ## Voir les logs du backend
	docker-compose logs -f backend

logs-frontend: ## Voir les logs du frontend
	docker-compose logs -f frontend

ps: ## Voir les conteneurs en cours
	docker-compose ps

clean: ## Nettoyer les conteneurs et volumes
	docker-compose down -v
	@echo "⚠️  Les données ont été supprimées"

clean-all: clean ## Nettoyer tout (conteneurs, volumes, images)
	docker-compose down -v --rmi all
	@echo "🧹 Nettoyage complet effectué"

rebuild: down clean build up ## Reconstruire et redémarrer

shell-backend: ## Accéder au shell du backend
	docker-compose exec backend sh

shell-frontend: ## Accéder au shell du frontend
	docker-compose exec frontend sh

dev: ## Démarrer en mode développement (avec logs)
	docker-compose up

install: ## Installation complète (build + démarrage)
	@echo "🚀 Installation de Florizar..."
	docker-compose build
	docker-compose up -d
	@echo ""
	@echo "✅ Florizar est installé et démarré !"
	@echo "📱 Accédez à l'application : http://localhost"
	@echo ""
	@echo "Commandes utiles :"
	@echo "  make logs       - Voir les logs"
	@echo "  make restart    - Redémarrer"
	@echo "  make down       - Arrêter"
