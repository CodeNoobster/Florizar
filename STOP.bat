@echo off
title Florizar - Arret
color 0E

echo.
echo ========================================
echo   FLORIZAR - Arret des services
echo ========================================
echo.

:: Tuer les processus Node.js (backend et frontend)
echo [*] Arret du Backend...
taskkill /F /FI "WINDOWTITLE eq Florizar Backend*" >nul 2>&1

echo [*] Arret du Frontend...
taskkill /F /FI "WINDOWTITLE eq Florizar Frontend*" >nul 2>&1

:: Alternative : tuer tous les processus node
echo [*] Nettoyage des processus Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ========================================
echo   FLORIZAR ARRETE !
echo ========================================
echo.
pause
