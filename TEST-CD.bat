@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ========================================
echo    TEST CD BACKEND
echo ========================================
echo.

echo [1] Avant cd backend:
cd
dir /b | findstr "backend"
echo.

echo [2] Execution de: cd backend
cd backend

echo.
echo [3] Apres cd backend:
cd
echo.

echo [4] Liste des fichiers dans le repertoire actuel:
dir /b
echo.

echo [5] Est-ce que package.json existe ici ?
if exist "package.json" (
    echo [OK] package.json trouve dans le repertoire actuel
) else (
    echo [ERREUR] package.json PAS trouve - on n'est pas dans backend
)

echo.
echo ========================================
echo    FIN DU TEST
echo ========================================
echo.

pause
