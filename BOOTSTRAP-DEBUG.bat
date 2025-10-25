@echo off
REM ============================================
REM BOOTSTRAP DEBUG - Version avec fichier LOG
REM ============================================

set LOG_FILE=BOOTSTRAP-LOG.txt

echo.
echo ========================================
echo    FLORIZAR - BOOTSTRAP DEBUG
echo ========================================
echo.
echo Ecriture du log dans: %LOG_FILE%
echo.

REM Créer le fichier log
echo ======================================== > %LOG_FILE%
echo   BOOTSTRAP DEBUG LOG >> %LOG_FILE%
echo   Date: %DATE% %TIME% >> %LOG_FILE%
echo ======================================== >> %LOG_FILE%
echo. >> %LOG_FILE%

cd /d "%~dp0"
echo Repertoire: %CD% >> %LOG_FILE%
echo Repertoire: %CD%
echo. >> %LOG_FILE%

REM Tester PowerShell
echo Test 1: PowerShell >> %LOG_FILE%
powershell -Command "Write-Host 'PowerShell OK'" >> %LOG_FILE% 2>&1
if ERRORLEVEL 1 (
    echo ERREUR: PowerShell ne fonctionne pas ! >> %LOG_FILE%
    echo ERREUR: PowerShell ne fonctionne pas !
) else (
    echo PowerShell: OK >> %LOG_FILE%
    echo PowerShell: OK
)
echo. >> %LOG_FILE%

REM Tester Git
echo Test 2: Git >> %LOG_FILE%
git --version >> %LOG_FILE% 2>&1
if ERRORLEVEL 1 (
    echo Git: NON INSTALLE >> %LOG_FILE%
    echo Git: NON INSTALLE
) else (
    echo Git: INSTALLE >> %LOG_FILE%
    echo Git: INSTALLE
)
echo. >> %LOG_FILE%

REM Tester Node.js
echo Test 3: Node.js >> %LOG_FILE%
node --version >> %LOG_FILE% 2>&1
if ERRORLEVEL 1 (
    echo Node.js: NON INSTALLE >> %LOG_FILE%
    echo Node.js: NON INSTALLE
) else (
    echo Node.js: INSTALLE >> %LOG_FILE%
    echo Node.js: INSTALLE
)
echo. >> %LOG_FILE%

REM Tester npm
echo Test 4: npm >> %LOG_FILE%
npm --version >> %LOG_FILE% 2>&1
if ERRORLEVEL 1 (
    echo npm: NON INSTALLE >> %LOG_FILE%
    echo npm: NON INSTALLE
) else (
    echo npm: INSTALLE >> %LOG_FILE%
    echo npm: INSTALLE
)
echo. >> %LOG_FILE%

REM Vérifier si .git existe
echo Test 5: Depot Git >> %LOG_FILE%
if exist ".git\" (
    echo Depot Git: EXISTE >> %LOG_FILE%
    echo Depot Git: EXISTE
) else (
    echo Depot Git: N'EXISTE PAS >> %LOG_FILE%
    echo Depot Git: N'EXISTE PAS
)
echo. >> %LOG_FILE%

REM Lister les fichiers
echo Test 6: Fichiers dans le dossier >> %LOG_FILE%
dir /b >> %LOG_FILE% 2>&1
echo. >> %LOG_FILE%

REM Tester connexion Internet
echo Test 7: Connexion Internet >> %LOG_FILE%
ping -n 1 google.com >nul 2>&1
if ERRORLEVEL 1 (
    echo Internet: PAS DE CONNEXION >> %LOG_FILE%
    echo Internet: PAS DE CONNEXION
) else (
    echo Internet: OK >> %LOG_FILE%
    echo Internet: OK
)
echo. >> %LOG_FILE%

REM Tester téléchargement avec PowerShell
echo Test 8: Test telechargement >> %LOG_FILE%
echo Test de telechargement d'un petit fichier...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; try { Invoke-WebRequest -Uri 'https://www.google.com' -UseBasicParsing -TimeoutSec 10 | Out-Null; Write-Host 'OK' } catch { Write-Host 'ERREUR:' $_.Exception.Message }}" >> %LOG_FILE% 2>&1
echo. >> %LOG_FILE%

echo.
echo ========================================
echo   TESTS TERMINES
echo ========================================
echo.
echo Consultez %LOG_FILE% pour les details
echo.
echo Le fichier va s'ouvrir dans Notepad...
echo.

notepad %LOG_FILE%

pause
