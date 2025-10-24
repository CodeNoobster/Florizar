@echo off
title Florizar - Demarrage Docker
color 0A

echo.
echo ========================================
echo   FLORIZAR - Demarrage Docker
echo ========================================
echo.

:: Verifier si Docker est installe
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERREUR] Docker n'est pas installe !
    echo.
    echo Telechargez Docker Desktop : https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo [OK] Docker detecte
docker --version
echo.

:: Verifier si Docker Compose est installe
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERREUR] Docker Compose n'est pas installe !
    pause
    exit /b 1
)

echo [OK] Docker Compose detecte
docker-compose --version
echo.

echo ========================================
echo   Construction des images...
echo ========================================
echo.

docker-compose build
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERREUR] Build echoue !
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Demarrage des conteneurs...
echo ========================================
echo.

docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERREUR] Demarrage echoue !
    pause
    exit /b 1
)

:: Attendre 10 secondes que tout demarre
timeout /t 10 /nobreak >nul

:: Ouvrir le navigateur
echo [*] Ouverture du navigateur...
start http://localhost

echo.
echo ========================================
echo   FLORIZAR DEMARRE (Docker) !
echo ========================================
echo.
echo   Application : http://localhost
echo.
echo   Voir les logs :
echo     docker-compose logs -f
echo.
echo   Arreter :
echo     docker-compose down
echo     ou executez STOP-DOCKER.bat
echo.
echo ========================================
echo.
pause
