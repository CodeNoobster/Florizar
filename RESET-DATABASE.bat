@echo off
REM ============================================
REM RESET-DATABASE - Réinitialise la base de données
REM Sauvegarde l'ancienne base puis la supprime pour recréation
REM ============================================

echo.
echo ========================================
echo    REINITIALISATION BASE DE DONNEES
echo ========================================
echo.

cd /d "%~dp0"

REM Vérifier si la base de données existe
if not exist "backend\database.sqlite" (
    echo Aucune base de donnees existante
    echo La base sera creee au prochain demarrage
    echo.
    pause
    exit /b 0
)

echo ATTENTION: Cette operation va supprimer toutes vos donnees !
echo.
echo La base de donnees existante contient peut-etre des donnees.
echo Avant de la supprimer, une sauvegarde sera creee.
echo.
pause

REM Créer le dossier backups si nécessaire
if not exist "backups" mkdir backups

REM Créer un nom de sauvegarde avec date/heure
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set BACKUP_NAME=database_backup_%datetime:~0,8%_%datetime:~8,6%.sqlite

echo.
echo Sauvegarde de l'ancienne base de donnees...
copy "backend\database.sqlite" "backups\%BACKUP_NAME%"

if ERRORLEVEL 1 (
    echo ERREUR: Impossible de sauvegarder la base de donnees
    pause
    exit /b 1
)

echo Sauvegarde creee: backups\%BACKUP_NAME%
echo.

echo Suppression de l'ancienne base de donnees...
del "backend\database.sqlite"

if ERRORLEVEL 1 (
    echo ERREUR: Impossible de supprimer la base de donnees
    echo Fermez toutes les applications qui utilisent la base
    pause
    exit /b 1
)

REM Supprimer aussi les fichiers WAL et SHM si ils existent
if exist "backend\database.sqlite-wal" del "backend\database.sqlite-wal"
if exist "backend\database.sqlite-shm" del "backend\database.sqlite-shm"

echo.
echo ========================================
echo   BASE DE DONNEES REINITIALISEE !
echo ========================================
echo.
echo Sauvegarde: backups\%BACKUP_NAME%
echo.
echo Au prochain demarrage de l'application,
echo une nouvelle base de donnees sera creee
echo avec la structure correcte.
echo.
echo Vous pouvez maintenant relancer INSTALL-AND-START.bat
echo.
pause
