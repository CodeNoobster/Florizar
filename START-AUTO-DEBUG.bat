@echo off
REM ============================================
REM Version DEBUG - Ecrit tout dans START-LOG.txt
REM ============================================

set LOG_FILE=START-LOG.txt

echo Demarrage de Florizar (mode DEBUG)...
echo Tous les details sont ecrits dans: %LOG_FILE%
echo.

REM Créer le log
echo ======================================== > %LOG_FILE%
echo   DEMARRAGE FLORIZAR - DEBUG >> %LOG_FILE%
echo   Date: %DATE% %TIME% >> %LOG_FILE%
echo ======================================== >> %LOG_FILE%
echo. >> %LOG_FILE%

cd /d "%~dp0"
echo Repertoire de travail: %CD% >> %LOG_FILE%
echo. >> %LOG_FILE%

echo [0/8] Nettoyage des processus... >> %LOG_FILE%
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
taskkill /F /IM npm >nul 2>&1
timeout /t 2 /nobreak >nul
echo Nettoyage termine >> %LOG_FILE%
echo. >> %LOG_FILE%

echo [1/8] Verification de Node.js... >> %LOG_FILE%
node --version >> %LOG_FILE% 2>&1
if ERRORLEVEL 1 (
    echo ERREUR: Node.js non installe >> %LOG_FILE%
    echo ERREUR: Node.js non installe !
    notepad %LOG_FILE%
    pause
    exit /b 1
)
echo Node.js OK >> %LOG_FILE%
echo. >> %LOG_FILE%

echo [2/8] Installation backend... >> %LOG_FILE%
echo Installation backend...

if not exist "backend\package.json" (
    echo ERREUR: backend\package.json n'existe pas ! >> %LOG_FILE%
    notepad %LOG_FILE%
    pause
    exit /b 1
)
echo backend\package.json existe >> %LOG_FILE%

REM Nettoyer node_modules
if exist "backend\node_modules" (
    echo Suppression de backend\node_modules... >> %LOG_FILE%
    rmdir /S /Q "backend\node_modules" 2>nul
)

cd backend
echo Repertoire actuel: %CD% >> %LOG_FILE%
echo. >> %LOG_FILE%

echo Lancement de npm install... >> %LOG_FILE%
echo Installation en cours (peut prendre 1-2 minutes)...
npm install >> %LOG_FILE% 2>&1

echo. >> %LOG_FILE%
echo npm install termine, code retour: %ERRORLEVEL% >> %LOG_FILE%
echo. >> %LOG_FILE%

echo Attente de 3 secondes pour synchronisation... >> %LOG_FILE%
timeout /t 3 /nobreak >nul

echo Verification de l'existence des packages... >> %LOG_FILE%
echo. >> %LOG_FILE%

echo Test 1 - dir node_modules: >> %LOG_FILE%
dir node_modules >> %LOG_FILE% 2>&1
echo. >> %LOG_FILE%

echo Test 2 - dir node_modules\express: >> %LOG_FILE%
dir node_modules\express >> %LOG_FILE% 2>&1
echo. >> %LOG_FILE%

echo Test 3 - if exist node_modules\express: >> %LOG_FILE%
if exist "node_modules\express" (
    echo express EXISTE >> %LOG_FILE%
) else (
    echo express N'EXISTE PAS >> %LOG_FILE%
)
echo. >> %LOG_FILE%

echo Test 4 - Liste des packages installes: >> %LOG_FILE%
dir /b node_modules >> %LOG_FILE% 2>&1
echo. >> %LOG_FILE%

echo Test 5 - Compter les packages: >> %LOG_FILE%
for /f %%i in ('dir /b node_modules ^| find /c /v ""') do echo Nombre de packages: %%i >> %LOG_FILE%
echo. >> %LOG_FILE%

REM Vérification finale
if not exist "node_modules\express" (
    echo. >> %LOG_FILE%
    echo ========================================== >> %LOG_FILE%
    echo ERREUR: Express non trouve apres npm install >> %LOG_FILE%
    echo ========================================== >> %LOG_FILE%
    echo. >> %LOG_FILE%
    echo Repertoire actuel: %CD% >> %LOG_FILE%
    echo. >> %LOG_FILE%
    cd ..
    echo.
    echo ERREUR: Express non trouve !
    echo Consultez START-LOG.txt pour details
    notepad %LOG_FILE%
    pause
    exit /b 1
)

echo. >> %LOG_FILE%
echo SUCCESS: Backend installe correctement ! >> %LOG_FILE%
echo - express: OK >> %LOG_FILE%
echo. >> %LOG_FILE%

cd ..

echo. >> %LOG_FILE%
echo ========================================== >> %LOG_FILE%
echo   INSTALLATION BACKEND REUSSIE ! >> %LOG_FILE%
echo ========================================== >> %LOG_FILE%
echo. >> %LOG_FILE%

echo.
echo Installation backend reussie !
echo Consultez START-LOG.txt pour tous les details
echo.
notepad %LOG_FILE%
pause
