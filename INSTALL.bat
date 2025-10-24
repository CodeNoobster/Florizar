@echo off
REM ============================================
REM Script d'installation initiale de Florizar
REM Configure automatiquement le projet
REM ============================================

echo.
echo ========================================
echo    INSTALLATION FLORIZAR
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

echo [1/6] Verification de Node.js...
node --version
echo.

echo [2/6] Installation des dependances backend...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de l'installation des dependances backend
    pause
    exit /b 1
)
echo Backend installe avec succes !
cd ..
echo.

echo [3/6] Installation des dependances frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de l'installation des dependances frontend
    pause
    exit /b 1
)
echo Frontend installe avec succes !
cd ..
echo.

echo [4/6] Configuration de l'environnement...
cd backend

REM Vérifier si .env existe déjà
if exist .env (
    echo Le fichier .env existe deja.
    set /p overwrite="Voulez-vous le remplacer ? (O/N): "
    if /i not "%overwrite%"=="O" (
        echo Configuration .env conservee
        goto :skip_env
    )
)

REM Copier .env.example vers .env
copy .env.example .env >nul

echo Fichier .env cree avec succes !
echo.

echo [5/6] Generation d'un JWT_SECRET securise...

REM Générer un JWT_SECRET aléatoire
for /f "delims=" %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%i

REM Remplacer la ligne JWT_SECRET dans .env
powershell -Command "(Get-Content .env) -replace 'JWT_SECRET=.*', 'JWT_SECRET=%JWT_SECRET%' | Set-Content .env"

echo JWT_SECRET genere et configure automatiquement !
echo.

:skip_env

cd ..

echo [6/6] Creation des dossiers necessaires...
if not exist "backend\uploads" mkdir "backend\uploads"
if not exist "data" mkdir "data"
if not exist "data\uploads" mkdir "data\uploads"
if not exist "backups" mkdir "backups"
echo Dossiers crees avec succes !
echo.

echo ========================================
echo   INSTALLATION TERMINEE AVEC SUCCES !
echo ========================================
echo.
echo Votre application Florizar est prete a etre utilisee.
echo.
echo Configuration effectuee:
echo   - Dependencies backend installes
echo   - Dependencies frontend installes
echo   - Fichier .env configure avec JWT_SECRET securise
echo   - Dossiers crees (uploads, data, backups)
echo.
echo Prochaines etapes:
echo.
echo 1. MODE DEVELOPPEMENT (recommande pour tests):
echo    Double-cliquez sur START.bat
echo    L'application sera accessible sur http://localhost:3000
echo.
echo 2. MODE DOCKER (pour production):
echo    Double-cliquez sur START-DOCKER.bat
echo    L'application sera accessible sur http://localhost
echo.

set /p start="Voulez-vous demarrer l'application maintenant ? (O/N): "
if /i "%start%"=="O" (
    echo.
    echo Demarrage de l'application en mode developpement...
    start "" START.bat
) else (
    echo.
    echo Pour demarrer plus tard, lancez START.bat
)

echo.
pause
