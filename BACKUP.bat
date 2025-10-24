@echo off
title Florizar - Sauvegarde des donnees
color 0B

echo.
echo ========================================
echo   FLORIZAR - Sauvegarde des donnees
echo ========================================
echo.

:: Créer le dossier de backup s'il n'existe pas
if not exist "backups" mkdir backups

:: Créer un nom de fichier avec la date
set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FILE=backups\florizar_backup_%TIMESTAMP%.zip

echo [*] Creation de la sauvegarde...
echo.

:: Vérifier si 7zip est installé
where 7z >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    :: Utiliser 7zip si disponible
    7z a -tzip "%BACKUP_FILE%" backend\database.sqlite backend\uploads data\database.sqlite data\uploads -r
) else (
    :: Utiliser PowerShell sinon
    powershell -Command "Compress-Archive -Path 'backend\database.sqlite','backend\uploads','data\database.sqlite','data\uploads' -DestinationPath '%BACKUP_FILE%' -Force"
)

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERREUR] La sauvegarde a echoue !
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SAUVEGARDE REUSSIE !
echo ========================================
echo.
echo   Fichier : %BACKUP_FILE%
echo.
echo   Contenu :
echo   - Base de donnees SQLite
echo   - Photos uploadees
echo.
echo   Pour restaurer : executez RESTORE.bat
echo.
echo ========================================
echo.

:: Lister les sauvegardes existantes
echo Sauvegardes disponibles :
echo.
dir /B backups\*.zip 2>nul
echo.

pause
