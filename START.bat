@echo off
title Florizar - Demarrage
color 0A

echo.
echo ========================================
echo   FLORIZAR - Demarrage automatique
echo ========================================
echo.

:: Verifier si Node.js est installe
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERREUR] Node.js n'est pas installe !
    echo.
    echo Telechargez Node.js : https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detecte :
node --version
echo.

:: Verifier si npm est installe
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERREUR] npm n'est pas installe !
    pause
    exit /b 1
)

echo [OK] npm detecte :
npm --version
echo.

:: Installer les dependances backend si necessaire
if not exist "backend\node_modules" (
    echo ========================================
    echo   Installation Backend...
    echo ========================================
    cd backend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo [ERREUR] Installation backend echouee !
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Backend installe
    echo.
)

:: Installer les dependances frontend si necessaire
if not exist "frontend\node_modules" (
    echo ========================================
    echo   Installation Frontend...
    echo ========================================
    cd frontend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo [ERREUR] Installation frontend echouee !
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Frontend installe
    echo.
)

echo ========================================
echo   Demarrage des services...
echo ========================================
echo.

:: Demarrer le backend dans une nouvelle fenetre
echo [*] Demarrage du Backend (port 5000)...
start "Florizar Backend" cmd /k "cd backend && npm start"

:: Attendre 3 secondes
timeout /t 3 /nobreak >nul

:: Demarrer le frontend dans une nouvelle fenetre
echo [*] Demarrage du Frontend (port 3000)...
start "Florizar Frontend" cmd /k "cd frontend && npm run dev"

:: Attendre 5 secondes
timeout /t 5 /nobreak >nul

:: Ouvrir le navigateur
echo [*] Ouverture du navigateur...
start http://localhost:3000

echo.
echo ========================================
echo   FLORIZAR DEMARRE !
echo ========================================
echo.
echo   Backend  : http://localhost:5000
echo   Frontend : http://localhost:3000
echo.
echo   Deux fenetres se sont ouvertes :
echo   - Backend (API)
echo   - Frontend (Interface)
echo.
echo   Pour arreter : fermez les 2 fenetres
echo   ou executez STOP.bat
echo.
echo ========================================
echo.
pause
