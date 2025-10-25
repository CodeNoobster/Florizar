@echo off
setlocal enabledelayedexpansion
REM ============================================
REM INSTALL-AND-START - Version ultra-simple
REM Clone, installe et lance Florizar
REM Fait automatiquement git pull si le projet existe
REM ============================================

echo.
echo ========================================
echo    FLORIZAR - INSTALLATION
echo ========================================
echo.

cd /d "%~dp0"
echo Repertoire: %CD%
echo.

REM ============================================
REM MISE A JOUR OU CLONAGE DU PROJET
REM ============================================

REM Vérifier si c'est déjà un dépôt Git
if exist ".git\" (
    echo Etape 1/3: Mise a jour depuis GitHub...
    echo.

    REM Sauvegarder les modifications locales si nécessaire
    git status --porcelain >nul 2>&1
    if not ERRORLEVEL 1 (
        for /f %%i in ('git status --porcelain 2^>nul ^| find /c /v ""') do set CHANGES=%%i
        if not "!CHANGES!"=="0" (
            echo Modifications locales detectees, sauvegarde...
            git stash push -m "Auto-sauvegarde %DATE% %TIME%"
        )
    )

    echo Telechargement des mises a jour...
    git pull origin main 2>nul

    if ERRORLEVEL 1 (
        git pull origin master 2>nul
        if ERRORLEVEL 1 (
            echo ATTENTION: Impossible de recuperer les mises a jour
            echo Verifiez votre connexion Internet
            echo Le script va continuer avec la version actuelle
            timeout /t 3 /nobreak
        )
    )

    echo.
    echo Mise a jour terminee !
    echo.
    goto install_deps
)

REM Si pas de dépôt Git, cloner
echo Etape 1/3: Clonage du projet...
echo.
echo Repository: https://github.com/CodeNoobster/Florizar.git
echo Dossier temporaire pour clonage...
echo.

REM Créer un nom de dossier temporaire unique
set TEMP_DIR=temp_%RANDOM%_%RANDOM%

echo Clonage en cours (30-60 secondes)...
git clone https://github.com/CodeNoobster/Florizar.git %TEMP_DIR%

if ERRORLEVEL 1 (
    echo.
    echo ERREUR: Le clonage a echoue !
    echo Verifiez votre connexion Internet.
    echo.
    pause
    exit /b 1
)

echo.
echo Copie des fichiers...
xcopy /E /I /Y /Q "%TEMP_DIR%\*" .
xcopy /E /I /Y /H /Q "%TEMP_DIR%\.git" .git

echo Nettoyage...
rmdir /S /Q %TEMP_DIR%

echo.
echo Clonage termine !
echo.

:install_deps

REM ============================================
REM NETTOYAGE BASE DE DONNEES OBSOLETE
REM ============================================

REM Supprimer l'ancienne base de données si elle existe
REM (Elle sera recréée automatiquement avec le bon schéma)
if exist "backend\database.sqlite" (
    echo.
    echo Suppression de l'ancienne base de donnees...

    REM Sauvegarder d'abord si le dossier backups existe
    if not exist "backups" mkdir backups

    REM Créer un nom de sauvegarde avec date/heure
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set datetime=%%I
    if defined datetime (
        copy "backend\database.sqlite" "backups\database_backup_!datetime:~0,8!_!datetime:~8,6!.sqlite" >nul 2>&1
        echo Ancienne base sauvegardee dans backups\
    )

    REM Supprimer les fichiers de base de données
    del /F /Q "backend\database.sqlite" >nul 2>&1
    del /F /Q "backend\database.sqlite-wal" >nul 2>&1
    del /F /Q "backend\database.sqlite-shm" >nul 2>&1

    echo Base de donnees obsolete supprimee
    echo Une nouvelle base sera creee automatiquement
    echo.
)

REM ============================================
REM INSTALLATION BACKEND
REM ============================================

echo Etape 2/3: Installation des dependances...
echo.

echo Installation backend (2-3 minutes)...
cd backend

if not exist "package.json" (
    echo ERREUR: backend\package.json manquant !
    pause
    exit /b 1
)

call npm install

if not exist "node_modules\express" (
    echo.
    echo ERREUR: Installation backend echouee
    echo.
    pause
    cd ..
    exit /b 1
)

REM Créer .env si nécessaire
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo Fichier .env cree
    )
)

echo Backend installe !

cd ..

REM ============================================
REM INSTALLATION FRONTEND
REM ============================================

echo.
echo Installation frontend (2-3 minutes)...
cd frontend

if not exist "package.json" (
    echo ERREUR: frontend\package.json manquant !
    pause
    exit /b 1
)

call npm install

if not exist "node_modules\react" (
    echo.
    echo ERREUR: Installation frontend echouee
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
echo Installation terminee !
echo.

REM ============================================
REM DEMARRAGE
REM ============================================

echo Etape 3/3: Demarrage de l'application...
echo.

REM Nettoyer processus existants
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
timeout /t 2 /nobreak >nul

REM Libérer ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 1 /nobreak >nul

echo Demarrage du backend...
cd backend
start "Florizar Backend - NE PAS FERMER" cmd /k "node src/server.js"
cd ..

echo Attente du demarrage du backend...
set /a counter=0

:wait_loop
timeout /t 2 /nobreak >nul

REM Tester si le port 5000 est ouvert
powershell -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('localhost', 5000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1

if not ERRORLEVEL 1 goto backend_ready

set /a counter+=1
if %counter% LSS 15 (
    echo Tentative %counter%/15...
    goto wait_loop
)

echo.
echo ERREUR: Le backend n'a pas demarre
echo Verifiez la fenetre "Florizar Backend"
echo.
pause
exit /b 1

:backend_ready
echo Backend demarre avec succes !

echo.
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
echo Frontend: http://localhost:3000
echo.
echo L'application s'ouvre dans votre navigateur...
echo.
echo IMPORTANT:
echo - Gardez les 2 fenetres "Backend" et "Frontend" ouvertes
echo - Pour arreter: Fermez ces 2 fenetres
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Installation et demarrage termines !
echo.
pause
