@echo off
setlocal enabledelayedexpansion
REM ============================================
REM CLEAN-AND-RESTART - Nettoyage complet
REM Supprime base de données, cache, node_modules
REM Force git pull et redémarre tout proprement
REM ============================================

echo.
echo ========================================
echo    FLORIZAR - NETTOYAGE COMPLET
echo ========================================
echo.

cd /d "%~dp0"

echo ATTENTION: Cette operation va:
echo - Supprimer l'ancienne base de donnees
echo - Forcer la mise a jour depuis GitHub
echo - Supprimer tous les caches
echo - Reinstaller les dependances
echo.
pause

REM ============================================
REM 1. FERMETURE DES PROCESSUS
REM ============================================

echo.
echo [1/7] Fermeture des processus Node.js...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
timeout /t 2 /nobreak >nul
echo Processus fermes

REM ============================================
REM 2. SUPPRESSION BASE DE DONNEES
REM ============================================

echo.
echo [2/7] Suppression de l'ancienne base de donnees...

if exist "backend\database.sqlite" (
    if not exist "backups" mkdir backups

    REM Sauvegarder
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set datetime=%%I
    if defined datetime (
        copy "backend\database.sqlite" "backups\database_backup_!datetime:~0,8!_!datetime:~8,6!.sqlite" >nul 2>&1
        echo Ancienne base sauvegardee
    )

    del /F /Q "backend\database.sqlite" >nul 2>&1
    del /F /Q "backend\database.sqlite-wal" >nul 2>&1
    del /F /Q "backend\database.sqlite-shm" >nul 2>&1
    echo Base de donnees supprimee
) else (
    echo Aucune base de donnees a supprimer
)

REM ============================================
REM 3. MISE A JOUR FORCEE DEPUIS GITHUB
REM ============================================

echo.
echo [3/7] Mise a jour forcee depuis GitHub...

if exist ".git\" (
    echo Annulation des modifications locales...
    git reset --hard >nul 2>&1

    echo Telechargement des mises a jour...
    git pull origin main 2>nul

    if ERRORLEVEL 1 (
        git pull origin master 2>nul
    )

    echo Mise a jour terminee
) else (
    echo ATTENTION: Pas de depot Git detecte !
    echo Ce script doit etre lance depuis un depot clone.
    pause
    exit /b 1
)

REM ============================================
REM 4. NETTOYAGE CACHE FRONTEND
REM ============================================

echo.
echo [4/7] Nettoyage du cache frontend...

if exist "frontend\node_modules" (
    echo Suppression node_modules frontend...
    rmdir /S /Q "frontend\node_modules"
)

if exist "frontend\.vite" (
    echo Suppression cache Vite...
    rmdir /S /Q "frontend\.vite"
)

if exist "frontend\dist" (
    echo Suppression dist...
    rmdir /S /Q "frontend\dist"
)

echo Cache frontend nettoye

REM ============================================
REM 5. REINSTALLATION DEPENDANCES
REM ============================================

echo.
echo [5/7] Reinstallation des dependances...

echo Installation backend...
cd backend
call npm install
cd ..

echo Installation frontend...
cd frontend
call npm install
cd ..

echo Dependances installees

REM ============================================
REM 6. PREPARATION ENVIRONNEMENT
REM ============================================

echo.
echo [6/7] Preparation de l'environnement...

if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo Fichier .env cree
    )
)

if not exist "backend\uploads" mkdir backend\uploads
if not exist "data" mkdir data
if not exist "data\uploads" mkdir data\uploads
if not exist "backups" mkdir backups

REM ============================================
REM 7. DEMARRAGE
REM ============================================

echo.
echo [7/7] Demarrage de l'application...
echo.

REM Libérer les ports
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

echo Attente du backend...
set /a counter=0

:wait_backend
timeout /t 2 /nobreak >nul

powershell -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('localhost', 5000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1

if not ERRORLEVEL 1 goto backend_ready

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

:backend_ready
echo Backend demarre !

echo Demarrage du frontend...
cd frontend
start "Florizar Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   NETTOYAGE ET REDEMARRAGE TERMINES !
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo L'application s'ouvre dans votre navigateur...
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo IMPORTANT: Dans le navigateur, faites Ctrl+Shift+R
echo pour forcer le rechargement complet !
echo.
pause
