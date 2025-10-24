@echo off
title Florizar - Restauration des donnees
color 0E

echo.
echo ========================================
echo   FLORIZAR - Restauration des donnees
echo ========================================
echo.

:: Lister les sauvegardes disponibles
if not exist "backups" (
    color 0C
    echo [ERREUR] Aucune sauvegarde trouvee !
    echo.
    echo Executez d'abord BACKUP.bat
    pause
    exit /b 1
)

echo Sauvegardes disponibles :
echo.
dir /B backups\*.zip 2>nul
echo.

:: Demander quelle sauvegarde restaurer
set /p BACKUP_FILE="Entrez le nom du fichier de sauvegarde : "

if not exist "backups\%BACKUP_FILE%" (
    color 0C
    echo [ERREUR] Fichier non trouve : %BACKUP_FILE%
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ATTENTION !
echo ========================================
echo.
echo   Cette operation va REMPLACER :
echo   - La base de donnees actuelle
echo   - Les photos actuelles
echo.
echo   Les donnees actuelles seront PERDUES !
echo.
set /p CONFIRM="Voulez-vous continuer ? (oui/non) : "

if /i not "%CONFIRM%"=="oui" (
    echo.
    echo [*] Restauration annulee
    pause
    exit /b 0
)

echo.
echo [*] Restauration en cours...

:: Extraire la sauvegarde
where 7z >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    7z x "backups\%BACKUP_FILE%" -y -aoa
) else (
    powershell -Command "Expand-Archive -Path 'backups\%BACKUP_FILE%' -DestinationPath '.' -Force"
)

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERREUR] La restauration a echoue !
    pause
    exit /b 1
)

echo.
echo ========================================
echo   RESTAURATION REUSSIE !
echo ========================================
echo.
echo   Les donnees ont ete restaurees.
echo.
pause
