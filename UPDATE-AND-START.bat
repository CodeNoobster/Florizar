@echo off
REM ============================================
REM UPDATE-AND-START - Script Principal Florizar
REM 1. Met a jour depuis GitHub
REM 2. Installe les dependances si necessaire
REM 3. Lance l'application
REM ============================================

cd /d "%~dp0"

echo.
echo ========================================
echo    FLORIZAR - MISE A JOUR ET DEMARRAGE
echo ========================================
echo.
echo Repertoire: %CD%
echo.

REM ============================================
REM ETAPE 1: MISE A JOUR DEPUIS GITHUB
REM ============================================

echo [1/4] Verification de Git...

REM Vérifier si Git est installé
git --version >nul 2>&1
if ERRORLEVEL 1 (
    echo.
    echo ATTENTION: Git n'est pas installe
    echo Le script va continuer sans mise a jour
    echo Pour activer les mises a jour, installez Git depuis: https://git-scm.com/
    echo.
    timeout /t 3 /nobreak
    goto skip_update
)

echo Git installe: OK

REM Vérifier si c'est un dépôt Git
if not exist ".git" (
    echo.
    echo ATTENTION: Ce dossier n'est pas un depot Git
    echo Le script va continuer sans mise a jour
    echo.
    timeout /t 3 /nobreak
    goto skip_update
)

echo Depot Git: OK

echo.
echo [2/4] Mise a jour depuis GitHub...
echo.

REM Sauvegarder les modifications locales si nécessaire
git status --porcelain >nul 2>&1
if ERRORLEVEL 1 goto pull_update

REM S'il y a des modifications locales, les sauvegarder
for /f %%i in ('git status --porcelain 2^>nul ^| find /c /v ""') do set CHANGES=%%i
if not "%CHANGES%"=="0" (
    echo Des modifications locales detectees, sauvegarde...
    git stash push -m "Auto-sauvegarde avant mise a jour %DATE% %TIME%"
)

:pull_update
echo Telechargement de la derniere version...
git pull origin main 2>nul

if ERRORLEVEL 1 (
    REM Si main échoue, essayer master
    git pull origin master 2>nul

    if ERRORLEVEL 1 (
        echo.
        echo ATTENTION: Impossible de recuperer les mises a jour
        echo Verifiez votre connexion Internet
        echo Le script va continuer avec la version actuelle
        echo.
        timeout /t 3 /nobreak
        goto skip_update
    )
)

echo.
echo Mise a jour reussie !
echo Version la plus recente recuperee depuis GitHub
echo.
goto update_done

:skip_update
echo Utilisation de la version locale actuelle
echo.

:update_done

REM ============================================
REM ETAPE 2: NETTOYAGE DES PROCESSUS
REM ============================================

echo [3/4] Nettoyage des processus existants...

taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
taskkill /F /IM npm >nul 2>&1

timeout /t 2 /nobreak >nul
echo Nettoyage termine

REM ============================================
REM ETAPE 3: VERIFICATION DES DEPENDANCES
REM ============================================

echo.
echo [4/4] Verification des dependances...

REM Vérifier Node.js
node --version >nul 2>&1
if ERRORLEVEL 1 (
    echo.
    echo ========================================
    echo   ERREUR: NODE.JS NON INSTALLE
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

REM Vérifier si installation nécessaire
set NEED_INSTALL=0

if not exist "backend\node_modules\express" set NEED_INSTALL=1
if not exist "backend\node_modules\bcryptjs" set NEED_INSTALL=1
if not exist "frontend\node_modules\react" set NEED_INSTALL=1
if not exist "frontend\node_modules\vite" set NEED_INSTALL=1
if not exist "backend\.env" set NEED_INSTALL=1

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

REM Nettoyer si nécessaire
if exist "node_modules" rmdir /S /Q "node_modules" 2>nul

npm install
timeout /t 3 /nobreak >nul

if not exist "node_modules\express" (
    echo.
    echo ========================================
    echo   ERREUR: Installation backend echouee
    echo ========================================
    echo.
    echo Tentez de lancer: npm cache clean --force
    echo puis relancez ce script
    echo.
    pause
    cd ..
    exit /b 1
)

echo Backend installe avec succes !

REM Configuration .env
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

REM Nettoyer si nécessaire
if exist "node_modules" rmdir /S /Q "node_modules" 2>nul

npm install
timeout /t 3 /nobreak >nul

if not exist "node_modules\react" (
    echo.
    echo ========================================
    echo   ERREUR: Installation frontend echouee
    echo ========================================
    echo.
    echo Tentez de lancer: npm cache clean --force
    echo puis relancez ce script
    echo.
    pause
    cd ..
    exit /b 1
)

echo Frontend installe avec succes !

cd ..

REM Créer dossiers nécessaires
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
REM ETAPE 4: LIBERATION DES PORTS ET DEMARRAGE
REM ============================================

:start_app

echo.
echo Preparation au demarrage...
echo.

REM Libérer port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Liberation du port 5000 (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

REM Libérer port 5173
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo Liberation du port 5173 (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 1 /nobreak >nul

echo.
echo ========================================
echo   DEMARRAGE DE L'APPLICATION
echo ========================================
echo.

REM Démarrer le backend
echo Demarrage du backend...
cd backend
start "Florizar Backend - NE PAS FERMER" cmd /k "node src/server.js"
cd ..

REM Attendre que le backend démarre
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
echo ========================================
echo   ERREUR: BACKEND N'A PAS DEMARRE
echo ========================================
echo.
echo Verifiez la fenetre "Florizar Backend" pour voir l'erreur
echo.
pause
exit /b 1

:backend_ok

REM Démarrer le frontend
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
echo - NE FERMEZ PAS les fenetres Backend et Frontend
echo - L'application s'ouvre automatiquement dans votre navigateur
echo - Pour arreter: Fermez les 2 fenetres ou Ctrl+C dans chacune
echo.
echo Pour redemarrer l'application:
echo - Relancez UPDATE-AND-START.bat
echo - Il mettra automatiquement a jour depuis GitHub
echo.

timeout /t 3 /nobreak >nul

REM Ouvrir dans le navigateur
start http://localhost:5173

echo.
pause
