@echo off
REM ============================================
REM BOOTSTRAP VERBOSE - Version avec LOG detaille
REM Ecrit chaque etape dans BOOTSTRAP-VERBOSE-LOG.txt
REM ============================================

set LOG_FILE=BOOTSTRAP-VERBOSE-LOG.txt

echo.
echo ========================================
echo    FLORIZAR - BOOTSTRAP VERBOSE
echo ========================================
echo.
echo Toutes les operations sont loggees dans: %LOG_FILE%
echo.

REM Créer le log
echo ======================================== > %LOG_FILE%
echo   BOOTSTRAP VERBOSE LOG >> %LOG_FILE%
echo   Date: %DATE% %TIME% >> %LOG_FILE%
echo ======================================== >> %LOG_FILE%
echo. >> %LOG_FILE%

cd /d "%~dp0"
echo [LOG] Repertoire: %CD% >> %LOG_FILE%
echo Repertoire: %CD%
echo. >> %LOG_FILE%

REM ============================================
REM VERIFICATION GIT
REM ============================================

echo [LOG] [1/7] Verification de Git... >> %LOG_FILE%
echo [1/7] Verification de Git...

git --version >> %LOG_FILE% 2>&1
if ERRORLEVEL 1 (
    echo [LOG] Git NON installe - Installation necessaire >> %LOG_FILE%
    echo Git NON installe - Installation necessaire
    echo [LOG] Veuillez installer Git manuellement depuis https://git-scm.com/ >> %LOG_FILE%
    notepad %LOG_FILE%
    pause
    exit /b 1
) else (
    echo [LOG] Git installe: OK >> %LOG_FILE%
    echo Git installe: OK
)
echo. >> %LOG_FILE%

REM ============================================
REM VERIFICATION NODE.JS
REM ============================================

echo [LOG] [2/7] Verification de Node.js... >> %LOG_FILE%
echo [2/7] Verification de Node.js...

node --version >> %LOG_FILE% 2>&1
if ERRORLEVEL 1 (
    echo [LOG] Node.js NON installe - Installation necessaire >> %LOG_FILE%
    echo Node.js NON installe - Installation necessaire
    echo [LOG] Veuillez installer Node.js manuellement depuis https://nodejs.org/ >> %LOG_FILE%
    notepad %LOG_FILE%
    pause
    exit /b 1
) else (
    echo [LOG] Node.js installe: OK >> %LOG_FILE%
    echo Node.js installe: OK
)
echo. >> %LOG_FILE%

REM ============================================
REM DETECTION DEPOT GIT
REM ============================================

echo [LOG] [3/7] Verification du depot Git... >> %LOG_FILE%
echo [3/7] Verification du depot Git...

if exist ".git\" (
    echo [LOG] Depot Git detecte (.git\ existe) >> %LOG_FILE%
    echo Depot Git detecte - Mise a jour...
    goto update_repo
)

if exist ".git" (
    echo [LOG] Depot Git detecte (.git existe) >> %LOG_FILE%
    echo Depot Git detecte - Mise a jour...
    goto update_repo
)

echo [LOG] Pas de depot Git - Clonage necessaire >> %LOG_FILE%
echo Pas de depot Git - Clonage necessaire
goto clone_repo

REM ============================================
REM CLONAGE
REM ============================================

:clone_repo
echo. >> %LOG_FILE%
echo [LOG] ======================================== >> %LOG_FILE%
echo [LOG] CLONAGE DU PROJET >> %LOG_FILE%
echo [LOG] ======================================== >> %LOG_FILE%
echo.
echo ========================================
echo   CLONAGE DU PROJET
echo ========================================
echo.

set TEMP_CLONE=florizar_temp_%RANDOM%
echo [LOG] Dossier temporaire: %TEMP_CLONE% >> %LOG_FILE%
echo.
echo Clonage depuis GitHub dans dossier temporaire...
echo Cela peut prendre 30-60 secondes...
echo.

echo [LOG] Commande: git clone https://github.com/CodeNoobster/Florizar.git %TEMP_CLONE% >> %LOG_FILE%

git clone https://github.com/CodeNoobster/Florizar.git %TEMP_CLONE% >> %LOG_FILE% 2>&1

if ERRORLEVEL 1 (
    echo. >> %LOG_FILE%
    echo [LOG] ERREUR: Clonage echoue >> %LOG_FILE%
    echo.
    echo ERREUR: Clonage echoue
    echo Consultez le log pour details
    notepad %LOG_FILE%
    pause
    exit /b 1
)

echo [LOG] Clonage reussi >> %LOG_FILE%
echo Clonage reussi !
echo.

echo [LOG] Copie des fichiers vers le dossier actuel... >> %LOG_FILE%
echo Copie des fichiers...

xcopy /E /I /Y "%TEMP_CLONE%\*" . >> %LOG_FILE% 2>&1
echo [LOG] xcopy contenu termine >> %LOG_FILE%

xcopy /E /I /Y /H "%TEMP_CLONE%\.git" .git >> %LOG_FILE% 2>&1
echo [LOG] xcopy .git termine >> %LOG_FILE%

rmdir /S /Q %TEMP_CLONE% >> %LOG_FILE% 2>&1
echo [LOG] Dossier temporaire supprime >> %LOG_FILE%

echo.
echo [LOG] Clonage termine avec succes ! >> %LOG_FILE%
echo Clonage termine !
echo.

goto install_deps

REM ============================================
REM MISE A JOUR
REM ============================================

:update_repo
echo. >> %LOG_FILE%
echo [LOG] [4/7] Mise a jour depuis GitHub... >> %LOG_FILE%
echo [4/7] Mise a jour...

git pull origin main >> %LOG_FILE% 2>&1
if ERRORLEVEL 1 (
    git pull origin master >> %LOG_FILE% 2>&1
)

echo [LOG] Mise a jour terminee >> %LOG_FILE%
echo Mise a jour terminee
echo.

REM ============================================
REM INSTALLATION DEPENDANCES
REM ============================================

:install_deps

echo [LOG] [5/7] Verification des dependances... >> %LOG_FILE%
echo [5/7] Verification des dependances...

set NEED_INSTALL=0

if not exist "backend\node_modules\express" (
    echo [LOG] Express manquant dans backend >> %LOG_FILE%
    set NEED_INSTALL=1
)

if not exist "frontend\node_modules\react" (
    echo [LOG] React manquant dans frontend >> %LOG_FILE%
    set NEED_INSTALL=1
)

if %NEED_INSTALL%==0 (
    echo [LOG] Dependances deja installees >> %LOG_FILE%
    echo Dependances deja installees
    goto start_app
)

echo.
echo ========================================
echo   INSTALLATION DES DEPENDANCES
echo ========================================
echo.

REM Backend
echo [LOG] Installation backend... >> %LOG_FILE%
echo Installation backend (cela peut prendre 2-3 minutes)...
cd backend

call npm install >> %LOG_FILE% 2>&1
timeout /t 3 /nobreak >nul

if not exist "node_modules\express" (
    echo [LOG] ERREUR: Express non installe apres npm install >> %LOG_FILE%
    echo ERREUR: Installation backend echouee
    notepad %LOG_FILE%
    pause
    cd ..
    exit /b 1
)

echo [LOG] Backend installe avec succes >> %LOG_FILE%
echo Backend installe !

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul 2>&1
        echo [LOG] Fichier .env cree >> %LOG_FILE%
    )
)

cd ..

REM Frontend
echo. >> %LOG_FILE%
echo [LOG] Installation frontend... >> %LOG_FILE%
echo.
echo Installation frontend (cela peut prendre 2-3 minutes)...
cd frontend

call npm install >> %LOG_FILE% 2>&1
timeout /t 3 /nobreak >nul

if not exist "node_modules\react" (
    echo [LOG] ERREUR: React non installe apres npm install >> %LOG_FILE%
    echo ERREUR: Installation frontend echouee
    notepad %LOG_FILE%
    pause
    cd ..
    exit /b 1
)

echo [LOG] Frontend installe avec succes >> %LOG_FILE%
echo Frontend installe !

cd ..

REM Dossiers
if not exist "backend\uploads" mkdir backend\uploads
if not exist "data" mkdir data
if not exist "data\uploads" mkdir data\uploads
if not exist "backups" mkdir backups

echo. >> %LOG_FILE%
echo [LOG] Installation terminee ! >> %LOG_FILE%
echo.
echo Installation terminee !
echo.

REM ============================================
REM DEMARRAGE
REM ============================================

:start_app

echo [LOG] [6/7] Preparation au demarrage... >> %LOG_FILE%
echo [6/7] Preparation au demarrage...

taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
timeout /t 2 /nobreak >nul

REM Liberer ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo [LOG] Liberation port 5000 (PID %%a) >> %LOG_FILE%
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo [LOG] Liberation port 5173 (PID %%a) >> %LOG_FILE%
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 1 /nobreak >nul

echo [LOG] [7/7] Demarrage de l'application... >> %LOG_FILE%
echo [7/7] Demarrage de l'application...
echo.

echo [LOG] Demarrage backend... >> %LOG_FILE%
echo Demarrage backend...
cd backend
start "Florizar Backend - NE PAS FERMER" cmd /k "node src/server.js"
cd ..

echo [LOG] Attente du backend... >> %LOG_FILE%
echo Attente du backend...
set counter=0

:wait_backend
timeout /t 2 /nobreak >nul

powershell -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('localhost', 5000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1

if ERRORLEVEL 1 goto check_counter
echo [LOG] Backend demarre ! >> %LOG_FILE%
echo Backend demarre !
goto backend_ok

:check_counter
set /a counter+=1
if %counter% LSS 15 (
    echo Tentative %counter%/15...
    goto wait_backend
)

echo. >> %LOG_FILE%
echo [LOG] ERREUR: Backend n'a pas demarre apres 30 secondes >> %LOG_FILE%
echo ERREUR: Backend n'a pas demarre
echo Verifiez la fenetre Backend pour voir l'erreur
notepad %LOG_FILE%
pause
exit /b 1

:backend_ok

echo [LOG] Demarrage frontend... >> %LOG_FILE%
echo Demarrage frontend...
cd frontend
start "Florizar Frontend" cmd /k "npm run dev"
cd ..

echo. >> %LOG_FILE%
echo [LOG] ======================================== >> %LOG_FILE%
echo [LOG] APPLICATION DEMARREE AVEC SUCCES ! >> %LOG_FILE%
echo [LOG] ======================================== >> %LOG_FILE%
echo.
echo ========================================
echo   APPLICATION DEMARREE !
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo L'application s'ouvre dans votre navigateur...
echo.

timeout /t 3 /nobreak >nul
start http://localhost:5173

echo Consultez %LOG_FILE% pour tous les details
echo.
pause
