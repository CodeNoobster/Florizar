@echo off
REM ============================================
REM BOOTSTRAP - Installation complete et automatique de Florizar
REM Installe automatiquement Git et Node.js si necessaire
REM Clone le projet, installe les dependances et lance l'application
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
REM VERIFICATION ET INSTALLATION DE GIT
REM ============================================

echo [1/7] Verification de Git...

git --version >nul 2>&1
if ERRORLEVEL 1 (
    echo.
    echo Git n'est pas installe - Installation automatique...
    echo.
    echo Telechargement de Git (environ 50 MB)...
    echo Cela peut prendre 1-2 minutes selon votre connexion...
    echo.

    REM Télécharger Git avec PowerShell
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe' -OutFile 'git-installer.exe'}"

    if ERRORLEVEL 1 (
        echo.
        echo ========================================
        echo   ERREUR: Telechargement de Git echoue
        echo ========================================
        echo.
        echo Impossible de telecharger Git automatiquement.
        echo.
        echo Installez Git manuellement depuis:
        echo https://git-scm.com/download/win
        echo.
        echo Puis relancez ce script.
        echo.
        pause
        exit /b 1
    )

    echo Installation de Git en cours...
    echo NE FERMEZ PAS cette fenetre !
    echo.

    REM Installer Git en mode silencieux
    git-installer.exe /VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS /COMPONENTS="icons,ext\reg\shellhere,assoc,assoc_sh"

    REM Attendre la fin de l'installation
    timeout /t 10 /nobreak >nul

    REM Supprimer l'installateur
    del git-installer.exe >nul 2>&1

    echo.
    echo Git installe avec succes !
    echo.
    echo IMPORTANT: Le script va redemarrer pour prendre en compte Git
    echo.
    pause

    REM Relancer ce script pour que Git soit dans le PATH
    start "" "%~f0"
    exit /b 0
) else (
    echo Git installe: OK
)

echo.

REM ============================================
REM VERIFICATION ET INSTALLATION DE NODE.JS
REM ============================================

echo [2/7] Verification de Node.js...

node --version >nul 2>&1
if ERRORLEVEL 1 (
    echo.
    echo Node.js n'est pas installe - Installation automatique...
    echo.
    echo Telechargement de Node.js LTS (environ 30 MB)...
    echo Cela peut prendre 1-2 minutes selon votre connexion...
    echo.

    REM Télécharger Node.js LTS avec PowerShell
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'nodejs-installer.msi'}"

    if ERRORLEVEL 1 (
        echo.
        echo ========================================
        echo   ERREUR: Telechargement de Node.js echoue
        echo ========================================
        echo.
        echo Impossible de telecharger Node.js automatiquement.
        echo.
        echo Installez Node.js manuellement depuis:
        echo https://nodejs.org/
        echo.
        echo Puis relancez ce script.
        echo.
        pause
        exit /b 1
    )

    echo Installation de Node.js en cours...
    echo NE FERMEZ PAS cette fenetre !
    echo Cela peut prendre 2-3 minutes...
    echo.

    REM Installer Node.js en mode silencieux
    msiexec /i nodejs-installer.msi /quiet /norestart

    REM Attendre la fin de l'installation
    timeout /t 15 /nobreak >nul

    REM Supprimer l'installateur
    del nodejs-installer.msi >nul 2>&1

    echo.
    echo Node.js installe avec succes !
    echo.
    echo IMPORTANT: Le script va redemarrer pour prendre en compte Node.js
    echo.
    pause

    REM Relancer ce script pour que Node.js soit dans le PATH
    start "" "%~f0"
    exit /b 0
) else (
    echo Node.js installe: OK
)

echo.

REM ============================================
REM DETECTION DE L'ETAT DU DEPOT
REM ============================================

echo [3/7] Verification du depot Git...

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

echo Clonage de Florizar depuis GitHub...
echo Repository: https://github.com/CodeNoobster/Florizar.git
echo.
echo Cela peut prendre 30-60 secondes...
echo.

REM Créer un dossier temporaire unique
set TEMP_CLONE=florizar_temp_%RANDOM%

REM Cloner dans un dossier temporaire
git clone https://github.com/CodeNoobster/Florizar.git %TEMP_CLONE%

if ERRORLEVEL 1 (
    echo.
    echo ========================================
    echo   ERREUR: CLONAGE ECHOUE
    echo ========================================
    echo.
    echo Causes possibles:
    echo - Pas de connexion Internet
    echo - Probleme d'acces a GitHub
    echo.
    echo Verifiez votre connexion Internet et reessayez.
    echo.
    pause
    exit /b 1
)

echo.
echo Copie des fichiers dans le dossier actuel...

REM Déplacer tout le contenu du dossier temporaire vers le dossier actuel
xcopy /E /I /Y "%TEMP_CLONE%\*" . >nul

REM Copier aussi le dossier .git (important pour git pull futur)
xcopy /E /I /Y /H "%TEMP_CLONE%\.git" .git >nul

REM Supprimer le dossier temporaire
rmdir /S /Q %TEMP_CLONE%

echo.
echo ========================================
echo   CLONAGE REUSSI !
echo ========================================
echo.
echo Le projet Florizar a ete telecharge avec succes !
echo.

goto install_deps

REM ============================================
REM MISE A JOUR DU PROJET (si existant)
REM ============================================

:update_repo
echo.
echo [4/7] Mise a jour depuis GitHub...
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

echo [5/7] Verification des dependances...

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
        echo Fichier .env cree
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

echo [6/7] Preparation au demarrage...
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

echo [7/7] Demarrage de l'application...
echo.

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
echo   APPLICATION DEMARREE AVEC SUCCES !
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
