@echo off
REM Script de test de la structure du projet

cd /d "%~dp0"

echo.
echo ========================================
echo    TEST DE LA STRUCTURE FLORIZAR
echo ========================================
echo.
echo Repertoire actuel: %CD%
echo.

echo Verification des dossiers:
echo.

if exist "backend" (
    echo [OK] Dossier backend existe
) else (
    echo [ERREUR] Dossier backend MANQUANT
)

if exist "frontend" (
    echo [OK] Dossier frontend existe
) else (
    echo [ERREUR] Dossier frontend MANQUANT
)

if exist "backend\package.json" (
    echo [OK] backend\package.json existe
) else (
    echo [ERREUR] backend\package.json MANQUANT
)

if exist "frontend\package.json" (
    echo [OK] frontend\package.json existe
) else (
    echo [ERREUR] frontend\package.json MANQUANT
)

if exist "backend\src\server.js" (
    echo [OK] backend\src\server.js existe
) else (
    echo [ERREUR] backend\src\server.js MANQUANT
)

echo.
echo Test du changement de repertoire:
echo.

echo Repertoire avant cd: %CD%
cd backend
if %ERRORLEVEL% EQU 0 (
    echo [OK] cd backend a reussi
    echo Repertoire apres cd: %CD%
    cd ..
) else (
    echo [ERREUR] cd backend a ECHOUE
)

echo.
echo ========================================
echo    FIN DU TEST
echo ========================================
echo.

pause
