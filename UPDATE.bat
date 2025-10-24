@echo off
REM ============================================
REM Script de mise à jour automatique Florizar
REM Avec sauvegarde et migration de données
REM ============================================

echo.
echo ========================================
echo    MISE A JOUR FLORIZAR
echo ========================================
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Git n'est pas installe ou pas dans le PATH
    echo Installez Git depuis https://git-scm.com/
    pause
    exit /b 1
)

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installe ou pas dans le PATH
    echo Installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo [1/7] Verification de l'environnement...
echo.

REM Vérifier qu'on est dans un dépôt Git
git status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Ce dossier n'est pas un depot Git
    pause
    exit /b 1
)

echo [2/7] Creation de la sauvegarde avant mise a jour...
echo.

REM Créer une sauvegarde avant la mise à jour
if exist BACKUP.bat (
    call BACKUP.bat
    if %ERRORLEVEL% NEQ 0 (
        echo ERREUR: Echec de la sauvegarde
        echo La mise a jour est annulee pour proteger vos donnees
        pause
        exit /b 1
    )
) else (
    echo ATTENTION: Script BACKUP.bat non trouve
    echo Sauvegarde manuelle recommandee avant de continuer
    set /p continue="Continuer quand meme ? (O/N): "
    if /i not "%continue%"=="O" (
        echo Mise a jour annulee
        pause
        exit /b 1
    )
)

echo.
echo [3/7] Recuperation des mises a jour depuis Git...
echo.

REM Sauvegarder la branche actuelle
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Branche actuelle: %CURRENT_BRANCH%

REM Récupérer les mises à jour
git fetch origin
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Impossible de recuperer les mises a jour
    pause
    exit /b 1
)

REM Vérifier s'il y a des modifications locales non commitées
git diff --quiet
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ATTENTION: Vous avez des modifications non sauvegardees
    git status --short
    echo.
    set /p stash="Voulez-vous les mettre de cote temporairement ? (O/N): "
    if /i "%stash%"=="O" (
        git stash push -m "Sauvegarde automatique avant mise a jour"
        set STASHED=1
    ) else (
        echo Mise a jour annulee
        pause
        exit /b 1
    )
)

REM Effectuer le pull
echo Mise a jour du code...
git pull origin %CURRENT_BRANCH%
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de la mise a jour Git
    if defined STASHED (
        echo Restauration de vos modifications...
        git stash pop
    )
    pause
    exit /b 1
)

echo.
echo [4/7] Mise a jour des dependances backend...
echo.

cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de l'installation des dependances backend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [5/7] Mise a jour des dependances frontend...
echo.

cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de l'installation des dependances frontend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [6/7] Verification de la securite (npm audit)...
echo.

cd backend
echo Audit de securite backend...
call npm audit --audit-level=high
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ATTENTION: Des vulnerabilites de securite ont ete detectees
    echo Il est recommande de les corriger
    set /p fix="Voulez-vous tenter de les corriger automatiquement ? (O/N): "
    if /i "%fix%"=="O" (
        call npm audit fix
    )
)
cd ..

cd frontend
echo Audit de securite frontend...
call npm audit --audit-level=high
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ATTENTION: Des vulnerabilites de securite ont ete detectees
    set /p fix="Voulez-vous tenter de les corriger automatiquement ? (O/N): "
    if /i "%fix%"=="O" (
        call npm audit fix
    )
)
cd ..

echo.
echo [7/7] Migration de la base de donnees...
echo.

echo Les migrations seront executees automatiquement au prochain demarrage
echo du serveur. Si une erreur se produit, une sauvegarde sera restauree.
echo.

REM Restaurer les modifications si elles avaient été mises de côté
if defined STASHED (
    echo Restauration de vos modifications locales...
    git stash pop
)

echo.
echo ========================================
echo   MISE A JOUR TERMINEE AVEC SUCCES
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Verifiez le fichier CHANGELOG.md pour les nouveautes
echo 2. Lancez l'application avec START.bat ou START-DOCKER.bat
echo 3. Les migrations de base de donnees s'executeront automatiquement
echo.
echo Une sauvegarde a ete creee dans le dossier backups/
echo En cas de probleme, utilisez RESTORE.bat
echo.

pause
