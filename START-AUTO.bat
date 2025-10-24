@echo off
REM ============================================
REM Script de démarrage automatique de Florizar
REM Lance le backend, vérifie qu'il tourne, puis lance le frontend
REM ============================================

echo.
echo ========================================
echo    DEMARRAGE AUTOMATIQUE FLORIZAR
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

echo [1/4] Demarrage du backend...
cd backend

REM Démarrer le backend en arrière-plan
start /B "Florizar Backend" cmd /c "node src/server.js > backend.log 2>&1"

echo [2/4] Attente du backend (verification du port 5000)...

REM Attendre que le backend soit prêt (max 30 secondes)
set /a counter=0
:wait_backend
timeout /t 2 /nobreak >nul

REM Vérifier si le port 5000 est ouvert
powershell -Command "$client = New-Object Net.Sockets.TcpClient; try { $client.Connect('localhost', 5000); $client.Close(); exit 0 } catch { exit 1 }" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo Backend demarre avec succes !
    goto backend_ready
)

set /a counter+=1
if %counter% LSS 15 (
    echo Attente... tentative %counter%/15
    goto wait_backend
)

echo ERREUR: Le backend n'a pas demarre apres 30 secondes
echo Verifiez le fichier backend\backend.log pour plus de details
cd ..
pause
exit /b 1

:backend_ready

cd ..

echo [3/4] Demarrage du frontend...
cd frontend

REM Démarrer le frontend
start "Florizar Frontend" cmd /k "npm run dev"

cd ..

echo.
echo [4/4] Florizar demarre !
echo.
echo ========================================
echo   APPLICATION DEMARREE AVEC SUCCES
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Pour arreter l'application:
echo   - Fermez les fenetres de commande
echo   - Ou appuyez sur Ctrl+C dans chaque fenetre
echo.
echo Le backend tourne en arriere-plan.
echo Les logs sont dans backend\backend.log
echo.

pause
