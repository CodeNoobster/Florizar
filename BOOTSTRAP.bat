@echo off
REM ============================================
REM BOOTSTRAP - Script de demarrage initial Florizar
REM
REM Ce script peut etre lance depuis un dossier VIDE
REM Il clone le projet Git ou met a jour, puis lance tout
REM ============================================

echo.
echo ========================================
echo    FLORIZAR - BOOTSTRAP
echo ========================================
echo.

cd /d "%~dp0"
echo Repertoire actuel: %CD%
echo.

REM ============================================
REM VERIFICATION DE GIT
REM ============================================

echo [1/6] Verification de Git...

git --version >nul 2>&1
if ERRORLEVEL 1 (
    echo.
    echo ========================================
    echo   ERREUR: GIT N'EST PAS INSTALLE
    echo ========================================
    echo.
    echo Ce script necessite Git pour fonctionner.
    echo.
    echo Telechargez et installez Git depuis:
    echo https://git-scm.com/download/win
    echo.
    echo Apres l'installation:
    echo 1. Redemarrez votre ordinateur
    echo 2. Relancez ce script
    echo.
    pause
    exit /b 1
)

echo Git installe: OK
echo.

REM ============================================
REM DETECTION DE L'ETAT DU DEPOT
REM ============================================

echo [2/6] Verification du depot...

set IS_GIT_REPO=0

REM Vérifier si .git existe
if exist ".git\" (
    set IS_GIT_REPO=1
    echo Depot Git detecte
    goto update_repo
)

if exist ".git" (
    set IS_GIT_REPO=1
    echo Depot Git detecte
    goto update_repo
)

REM Ce n'est pas un dépôt Git
echo Ce n'est pas encore un depot Git
goto clone_repo

REM ============================================
REM CLONAGE DU PROJET (si nouveau)
REM ============================================

:clone_repo
echo.
echo ========================================
echo   CLONAGE DU PROJET DEPUIS GITHUB
echo ========================================
echo.

REM Vérifier si le dossier contient déjà des fichiers (hors ce script)
set FILE_COUNT=0
for %%F in (*) do (
    if not "%%F"=="BOOTSTRAP.bat" (
        set /a FILE_COUNT+=1
    )
)

if %FILE_COUNT% GTR 0 (
    echo.
    echo ATTENTION: Le dossier n'est pas vide !
    echo.
    echo Le dossier contient deja des fichiers.
    echo Le clonage va echouer si le dossier n'est pas vide.
    echo.
    echo Options:
    echo 1. Supprimez tous les fichiers SAUF BOOTSTRAP.bat
    echo 2. OU creez un nouveau dossier vide et mettez-y BOOTSTRAP.bat
    echo.
    pause
    exit /b 1
)

echo Clonage de Florizar depuis GitHub...
echo Repository: https://github.com/CodeNoobster/Florizar.git
echo.
echo Cela peut prendre 30-60 secondes...
echo.

REM Cloner dans le dossier actuel (avec le point)
git clone https://github.com/CodeNoobster/Florizar.git .

if ERRORLEVEL 1 (
    echo.
    echo ========================================
    echo   ERREUR: CLONAGE ECHOUE
    echo ========================================
    echo.
    echo Causes possibles:
    echo - Pas de connexion Internet
    echo - Le dossier n'est pas vide
    echo - Probleme d'acces a GitHub
    echo.
    echo Verifiez votre connexion et reessayez.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   CLONAGE REUSSI !
echo ========================================
echo.
echo Le projet Florizar a ete telecharge.
echo.

goto install_deps

REM ============================================
REM MISE A JOUR DU PROJET (si existant)
REM ============================================

:update_repo
echo.
echo [3/6] Mise a jour depuis GitHub...
echo.

REM Sauvegarder les modifications locales
git status --porcelain >nul 2>&1
if not ERRORLEVEL 1 (
    for /f %%i in ('git status --porcelain 2^>nul ^| find /c /v ""') do set CHANGES=%%i
    if not "!CHANGES!"=="0" (
        echo Modifications locales detectees, sauvegarde...
        git stash push -m "Auto-sauvegarde %DATE% %TIME%"
    )
)

echo Telechargement des mises a jour...

REM Essayer main puis master
git pull origin main 2>nul
if ERRORLEVEL 1 (
    git pull origin master 2>nul
    if ERRORLEVEL 1 (
        echo.
        echo ATTENTION: Impossible de recuperer les mises a jour
        echo Le script va continuer avec la version actuelle
        echo.
        timeout /t 3 /nobreak
        goto install_deps
    )
)

echo.
echo Mise a jour reussie !
echo.

REM ============================================
REM INSTALLATION DES DEPENDANCES
REM ============================================

:install_deps

echo [4/6] Verification de Node.js...

node --version >nul 2>&1
if ERRORLEVEL 1 (
    echo.
    echo ========================================
    echo   ERREUR: NODE.JS N'EST PAS INSTALLE
    echo ========================================
    echo.
    echo Telechargez et installez Node.js depuis:
    echo https://nodejs.org/
    echo.
    echo Version recommandee: LTS (Long Term Support)
    echo.
    pause
    exit /b 1
)

echo Node.js installe: OK
echo.

echo [5/6] Verification des dependances...

set NEED_INSTALL=0

if not exist "backend\node_modules\express" set NEED_INSTALL=1
if not exist "frontend\node_modules\react" set NEED_INSTALL=1

if %NEED_INSTALL%==0 (
    echo Dependances deja installees !
    goto start_app
)

echo.
echo ========================================
echo   INSTALLATION DES DEPENDANCES
echo ========================================
echo.
echo Cette operation peut prendre 2-3 minutes...
echo.

REM Installation Backend
echo Installation du backend...
cd backend

if not exist "package.json" (
    echo ERREUR: backend\package.json manquant !
    pause
    exit /b 1
)

if exist "node_modules" rmdir /S /Q "node_modules" 2>nul

call npm install
timeout /t 3 /nobreak >nul

if not exist "node_modules\express" (
    echo.
    echo ERREUR: Installation backend echouee
    echo Essayez: npm cache clean --force
    echo.
    pause
    cd ..
    exit /b 1
)

echo Backend installe !

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul 2>&1
    )
)

cd ..

REM Installation Frontend
echo.
echo Installation du frontend...
cd frontend

if not exist "package.json" (
    echo ERREUR: frontend\package.json manquant !
    pause
    exit /b 1
)

if exist "node_modules" rmdir /S /Q "node_modules" 2>nul

call npm install
timeout /t 3 /nobreak >nul

if not exist "node_modules\react" (
    echo.
    echo ERREUR: Installation frontend echouee
    echo Essayez: npm cache clean --force
    echo.
    pause
    cd ..
    exit /b 1
)

echo Frontend installe !

cd ..

REM Créer dossiers
if not exist "backend\uploads" mkdir backend\uploads
if not exist "data" mkdir data
if not exist "data\uploads" mkdir data\uploads
if not exist "backups" mkdir backups

echo.
echo ========================================
echo   INSTALLATION TERMINEE !
echo ========================================
echo.

REM ============================================
REM DEMARRAGE DE L'APPLICATION
REM ============================================

:start_app

echo [6/6] Demarrage de l'application...
echo.

REM Nettoyer les processus
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
timeout /t 2 /nobreak >nul

REM Libérer les ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 1 /nobreak >nul

echo Demarrage du backend...
cd backend
start "Florizar Backend - NE PAS FERMER" cmd /k "node src/server.js"
cd ..

echo Attente du backend...
set counter=0

:wait_backend
timeout /t 2 /nobreak >nul

powershell -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('localhost', 5000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1

if ERRORLEVEL 1 goto check_counter
echo Backend demarre !
goto backend_ok

:check_counter
set /a counter+=1
if %counter% LSS 15 (
    echo Tentative %counter%/15...
    goto wait_backend
)

echo.
echo ERREUR: Backend n'a pas demarre
echo Verifiez la fenetre "Florizar Backend"
echo.
pause
exit /b 1

:backend_ok

echo Demarrage du frontend...
cd frontend
start "Florizar Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   APPLICATION DEMARREE !
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo IMPORTANT:
echo - NE fermez PAS les fenetres Backend et Frontend
echo - L'application s'ouvre dans votre navigateur
echo.
echo Pour redemarrer: Relancez BOOTSTRAP.bat
echo   Il mettra automatiquement a jour depuis GitHub
echo.

timeout /t 3 /nobreak >nul
start http://localhost:5173

pause
