@echo off
REM ============================================
REM Script de démarrage automatique de Florizar
REM VERSION SANS DELAYED EXPANSION (compatibilité maximale)
REM ============================================

REM Se positionner dans le répertoire du script
cd /d "%~dp0"

echo.
echo ========================================
echo    DEMARRAGE AUTOMATIQUE FLORIZAR
echo ========================================
echo.
echo Repertoire de travail: %CD%
echo.

echo [0/8] Nettoyage des processus existants...

REM Fermer tous les processus Node.js et npm existants
echo Fermeture de tous les processus Node.js...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
taskkill /F /IM npm >nul 2>&1

REM Attendre que les processus se terminent complètement
timeout /t 2 /nobreak >nul

echo Nettoyage termine

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if ERRORLEVEL 1 (
    echo ERREUR: Node.js n'est pas installe
    echo Telechargez et installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo [1/8] Verification des dependances...

REM Vérifier si les dépendances sont installées
set NEED_INSTALL=0

if not exist "backend\node_modules\express" set NEED_INSTALL=1
if not exist "backend\node_modules\bcryptjs" set NEED_INSTALL=1
if not exist "frontend\node_modules\react" set NEED_INSTALL=1
if not exist "frontend\node_modules\vite" set NEED_INSTALL=1
if not exist "backend\.env" set NEED_INSTALL=1

if %NEED_INSTALL%==1 goto do_install
echo Toutes les dependances sont correctement installees !
echo - Express, bcryptjs: OK
echo - React, Vite: OK
echo - Fichier .env: OK
goto skip_install

:do_install
echo.
echo ========================================
echo   INSTALLATION DES DEPENDANCES
echo ========================================
echo.
echo Cette operation peut prendre 2-3 minutes...
echo.

echo [2/8] Installation des dependances backend...

if not exist "backend\package.json" (
    echo.
    echo ERREUR CRITIQUE: backend\package.json n'existe pas !
    echo Le projet semble corrompu ou incomplet.
    echo Repertoire actuel: %CD%
    echo.
    pause
    exit /b 1
)

REM Nettoyer node_modules corrompu si existe
if exist "backend\node_modules" (
    echo Nettoyage de node_modules corrompu...
    rmdir /S /Q "backend\node_modules" 2>nul
)

cd backend
echo Installation dans: %CD%
echo.

REM Installer sans vérifier ERRORLEVEL (les vulnérabilités causent des codes erreur)
npm install

REM Attendre la synchronisation du système de fichiers
timeout /t 2 /nobreak >nul

REM Vérifier que les packages sont installés
if not exist "node_modules\express" (
    echo.
    echo ========================================
    echo   ERREUR: Installation backend echouee
    echo ========================================
    echo.
    echo Package express non trouve dans node_modules
    echo Repertoire actuel: %CD%
    echo.
    echo Packages installes:
    dir /b node_modules 2>nul
    echo.
    echo Erreurs possibles:
    echo - Probleme de synchronisation du systeme de fichiers
    echo - npm corrompu (executez: npm cache clean --force)
    echo - Chemin trop long ou caracteres speciaux
    echo - Antivirus bloquant npm
    echo.
    pause
    cd ..
    exit /b 1
)

echo.
echo Backend installe avec succes !
echo Packages installes: express, bcryptjs, jsonwebtoken, etc.
cd ..

echo [3/8] Installation des dependances frontend...

if not exist "frontend\package.json" (
    echo.
    echo ERREUR CRITIQUE: frontend\package.json n'existe pas !
    echo Le projet semble corrompu ou incomplet.
    echo Repertoire actuel: %CD%
    echo.
    pause
    exit /b 1
)

REM Nettoyer node_modules corrompu si existe
if exist "frontend\node_modules" (
    echo Nettoyage de node_modules corrompu...
    rmdir /S /Q "frontend\node_modules" 2>nul
)

cd frontend
echo Installation dans: %CD%
echo.

REM Installer sans vérifier ERRORLEVEL
npm install

REM Attendre la synchronisation du système de fichiers
timeout /t 2 /nobreak >nul

REM Vérifier que les packages sont installés
if not exist "node_modules\react" (
    echo.
    echo ========================================
    echo   ERREUR: Installation frontend echouee
    echo ========================================
    echo.
    echo Package react non trouve dans node_modules
    echo Repertoire actuel: %CD%
    echo.
    echo Packages installes:
    dir /b node_modules 2>nul
    echo.
    echo Erreurs possibles:
    echo - Probleme de synchronisation du systeme de fichiers
    echo - npm corrompu (executez: npm cache clean --force)
    echo - Chemin trop long ou caracteres speciaux
    echo - Antivirus bloquant npm
    echo.
    pause
    cd ..
    exit /b 1
)

echo.
echo Frontend installe avec succes !
echo Packages installes: react, vite, react-router-dom, etc.
cd ..

echo [4/8] Configuration de l'environnement...
cd backend
if not exist ".env" (
    copy .env.example .env >nul 2>&1

    REM Générer un JWT_SECRET sécurisé
    for /f "delims=" %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%i
    powershell -Command "(Get-Content .env) -replace 'JWT_SECRET=.*', 'JWT_SECRET=%JWT_SECRET%' | Set-Content .env"
    echo Fichier .env cree avec JWT_SECRET securise
)
cd ..

REM Créer les dossiers nécessaires
if not exist "backend\uploads" mkdir backend\uploads
if not exist "data" mkdir data
if not exist "data\uploads" mkdir data\uploads
if not exist "backups" mkdir backups

echo.
echo ========================================
echo   INSTALLATION TERMINEE !
echo ========================================
echo.

:skip_install

echo [5/8] Verification et liberation du port 5000 (backend)...

REM Vérifier si le port 5000 est occupé
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Port 5000 occupe par PID %%a - Liberation en cours...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 /nobreak >nul
)

echo Port 5000 libre

echo [6/8] Verification et liberation du port 5173 (frontend)...

REM Vérifier si le port 5173 est occupé
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo Port 5173 occupe par PID %%a - Liberation en cours...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 /nobreak >nul
)

echo Port 5173 libre

echo [7/8] Demarrage du backend...
cd backend

REM Démarrer le backend dans une fenêtre CMD séparée
start "Florizar Backend - NE PAS FERMER" cmd /k "node src/server.js"

echo Attente du backend (verification du port 5000)...

REM Attendre que le backend soit prêt (max 30 secondes)
set counter=0

:wait_backend
timeout /t 2 /nobreak >nul

REM Vérifier si le port 5000 est ouvert
powershell -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('localhost', 5000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1

if ERRORLEVEL 1 goto check_timeout
echo Backend demarre avec succes !
cd ..
goto backend_ready

:check_timeout
set /a counter+=1
if %counter% LSS 15 (
    echo Attente... tentative %counter%/15
    goto wait_backend
)

echo.
echo ========================================
echo   ERREUR: BACKEND N'A PAS DEMARRE
echo ========================================
echo.
echo Le backend n'a pas demarre apres 30 secondes.
echo.
echo VERIFIEZ LA FENETRE "Florizar Backend - NE PAS FERMER"
echo pour voir le message d'erreur exact.
echo.
echo Erreurs possibles:
echo - Dependances manquantes ou corrompues
echo - Port 5000 deja utilise
echo - Erreur dans le code backend
echo.
cd ..
pause
exit /b 1

:backend_ready

echo [8/8] Demarrage du frontend...
cd frontend

REM Démarrer le frontend
start "Florizar Frontend" cmd /k "npm run dev"

cd ..

echo.
echo Florizar demarre !
echo.
echo ========================================
echo   APPLICATION DEMARREE AVEC SUCCES
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo IMPORTANT:
echo - Gardez la fenetre "Florizar Backend" ouverte
echo - Gardez la fenetre "Florizar Frontend" ouverte
echo - Les erreurs s'affichent directement dans ces fenetres
echo.
echo Pour arreter l'application:
echo   - Fermez les fenetres "Florizar Backend" et "Florizar Frontend"
echo   - Ou appuyez sur Ctrl+C dans chaque fenetre
echo.

pause
