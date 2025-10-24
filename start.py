#!/usr/bin/env python3
"""
Florizar - Script de démarrage universel
Fonctionne sur Windows, Linux et macOS
"""

import os
import sys
import subprocess
import platform
import time
import webbrowser
import signal
from pathlib import Path

# Couleurs pour le terminal
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def clear_screen():
    """Nettoyer l'écran du terminal"""
    os.system('cls' if platform.system() == 'Windows' else 'clear')

def print_header():
    """Afficher l'en-tête"""
    clear_screen()
    print(f"{Colors.GREEN}{Colors.BOLD}")
    print("=" * 50)
    print("  FLORIZAR - Démarrage automatique")
    print("=" * 50)
    print(f"{Colors.END}")

def check_command(command):
    """Vérifier si une commande existe"""
    try:
        subprocess.run(
            [command, '--version'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_dependencies():
    """Vérifier les dépendances nécessaires"""
    print(f"{Colors.BLUE}Vérification des dépendances...{Colors.END}\n")

    # Vérifier Node.js
    if not check_command('node'):
        print(f"{Colors.RED}[ERREUR]{Colors.END} Node.js n'est pas installé !")
        print(f"\nTéléchargez Node.js : https://nodejs.org/")
        sys.exit(1)

    node_version = subprocess.run(
        ['node', '--version'],
        capture_output=True,
        text=True
    ).stdout.strip()
    print(f"{Colors.GREEN}[OK]{Colors.END} Node.js détecté : {node_version}")

    # Vérifier npm
    if not check_command('npm'):
        print(f"{Colors.RED}[ERREUR]{Colors.END} npm n'est pas installé !")
        sys.exit(1)

    npm_version = subprocess.run(
        ['npm', '--version'],
        capture_output=True,
        text=True
    ).stdout.strip()
    print(f"{Colors.GREEN}[OK]{Colors.END} npm détecté : {npm_version}\n")

def install_dependencies(directory, name):
    """Installer les dépendances npm si nécessaire"""
    node_modules = Path(directory) / 'node_modules'

    if not node_modules.exists():
        print(f"{Colors.BLUE}{'=' * 50}")
        print(f"  Installation {name}...")
        print(f"{'=' * 50}{Colors.END}")

        try:
            subprocess.run(
                ['npm', 'install'],
                cwd=directory,
                check=True
            )
            print(f"{Colors.GREEN}[OK]{Colors.END} {name} installé\n")
        except subprocess.CalledProcessError:
            print(f"{Colors.RED}[ERREUR]{Colors.END} Installation {name} échouée !")
            sys.exit(1)

def start_service(directory, command, name, log_file):
    """Démarrer un service en arrière-plan"""
    print(f"{Colors.GREEN}[*]{Colors.END} Démarrage du {name}...")

    # Créer le fichier de log
    log_path = Path(log_file)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    with open(log_file, 'w') as log:
        if platform.system() == 'Windows':
            # Windows : utiliser CREATE_NEW_CONSOLE
            process = subprocess.Popen(
                command,
                cwd=directory,
                stdout=log,
                stderr=subprocess.STDOUT,
                creationflags=subprocess.CREATE_NEW_CONSOLE,
                shell=True
            )
        else:
            # Unix : utiliser nohup
            process = subprocess.Popen(
                command,
                cwd=directory,
                stdout=log,
                stderr=subprocess.STDOUT,
                shell=True,
                preexec_fn=os.setpgrp if hasattr(os, 'setpgrp') else None
            )

    return process

def open_browser(url, delay=5):
    """Ouvrir le navigateur après un délai"""
    print(f"{Colors.GREEN}[*]{Colors.END} Ouverture du navigateur dans {delay}s...")
    time.sleep(delay)
    webbrowser.open(url)

def main():
    """Fonction principale"""
    print_header()

    # Vérifier les dépendances
    check_dependencies()

    # Installer les dépendances si nécessaire
    install_dependencies('backend', 'Backend')
    install_dependencies('frontend', 'Frontend')

    # Démarrer les services
    print(f"{Colors.BLUE}{'=' * 50}")
    print("  Démarrage des services...")
    print(f"{'=' * 50}{Colors.END}\n")

    # Démarrer le backend
    backend_process = start_service(
        'backend',
        'npm start',
        'Backend (port 5000)',
        'backend.log'
    )

    # Attendre que le backend démarre
    time.sleep(3)

    # Démarrer le frontend
    frontend_process = start_service(
        'frontend',
        'npm run dev',
        'Frontend (port 3000)',
        'frontend.log'
    )

    # Ouvrir le navigateur
    open_browser('http://localhost:3000', delay=5)

    # Afficher le résumé
    print(f"\n{Colors.GREEN}{'=' * 50}")
    print("  FLORIZAR DÉMARRÉ !")
    print(f"{'=' * 50}{Colors.END}\n")
    print(f"  Backend  : http://localhost:5000")
    print(f"  Frontend : http://localhost:3000\n")
    print(f"  Logs Backend  : backend.log")
    print(f"  Logs Frontend : frontend.log\n")
    print(f"{Colors.YELLOW}  Appuyez sur Ctrl+C pour arrêter{Colors.END}\n")
    print(f"{'=' * 50}\n")

    # Sauvegarder les PIDs
    with open('.florizar.pid', 'w') as f:
        f.write(f"{backend_process.pid}\n")
        f.write(f"{frontend_process.pid}\n")

    # Gérer l'arrêt propre
    def signal_handler(sig, frame):
        print(f"\n\n{Colors.YELLOW}[*] Arrêt des services...{Colors.END}")
        backend_process.terminate()
        frontend_process.terminate()

        # Attendre l'arrêt
        backend_process.wait()
        frontend_process.wait()

        # Nettoyer le fichier PID
        if os.path.exists('.florizar.pid'):
            os.remove('.florizar.pid')

        print(f"{Colors.GREEN}[OK] Services arrêtés{Colors.END}\n")
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Garder le script actif
    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        pass

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Interruption...{Colors.END}")
        sys.exit(0)
