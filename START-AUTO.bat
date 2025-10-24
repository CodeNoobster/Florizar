@echo off
REM ============================================
REM Script de démarrage automatique de Florizar
REM Lance le backend, vérifie qu'il tourne, puis lance le frontend
REM ============================================

echo.
echo ========================================
echo    DEMARRAGE AUTOMATIQUE FLORIZAR
echo ========================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installe
    echo Telechargez et installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo [1/8] Verification des dependances...

REM Vérifier si les dépendances sont installées
set NEED_INSTALL=0

if not exist "backend\node_modules" (
    echo Dependances backend manquantes
    set NEED_INSTALL=1
)

if not exist "frontend\node_modules" (
    echo Dependances frontend manquantes
    set NEED_INSTALL=1
)

if not exist "backend\.env" (
    echo Fichier .env manquant
    set NEED_INSTALL=1
)

if %NEED_INSTALL%==1 (
    echo.
    echo ========================================
    echo   INSTALLATION DES DEPENDANCES
    echo ========================================
    echo.

    echo [2/8] Installation des dependances backend...
    cd backend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERREUR: Installation backend echouee
        cd ..
        pause
        exit /b 1
    )
    cd ..

    echo [3/8] Installation des dependances frontend...
    cd frontend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERREUR: Installation frontend echouee
        cd ..
        pause
        exit /b 1
    )
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
) else (
    echo Toutes les dependances sont installees
)

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

REM Démarrer le backend en arrière-plan
start /B "Florizar Backend" cmd /c "node src/server.js > backend.log 2>&1"

echo Attente du backend (verification du port 5000)...

REM Attendre que le backend soit prêt (max 30 secondes)
set /a counter=0
:wait_backend
timeout /t 2 /nobreak >nul

REM Vérifier si le port 5000 est ouvert
powershell -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('localhost', 5000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo Backend demarre avec succes !
    goto backend_ready
)

set /a counter+=1
if %counter% LSS 15 (
    echo Attente... tentative %counter%/15
    goto wait_backend
)

echo ERREUR: Le backend n'a pas demarre apres 30 secondes
echo Verifiez le fichier backend\backend.log pour plus de details
cd ..
pause
exit /b 1

:backend_ready

cd ..

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
echo Pour arreter l'application:
echo   - Fermez les fenetres de commande
echo   - Ou appuyez sur Ctrl+C dans chaque fenetre
echo.
echo Le backend tourne en arriere-plan.
echo Les logs sont dans backend\backend.log
echo.

pause
