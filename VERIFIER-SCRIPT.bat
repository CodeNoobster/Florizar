@echo off
REM ============================================
REM Verification du contenu de START-AUTO.bat
REM ============================================

echo.
echo ========================================
echo   VERIFICATION DE START-AUTO.bat
echo ========================================
echo.

if not exist "START-AUTO.bat" (
    echo ERREUR: START-AUTO.bat n'existe pas dans ce repertoire !
    echo Repertoire actuel: %CD%
    pause
    exit /b 1
)

echo Fichier trouve: START-AUTO.bat
echo.
echo Affichage des 10 premieres lignes:
echo ----------------------------------------

REM Afficher les 10 premières lignes
powershell -Command "Get-Content 'START-AUTO.bat' | Select-Object -First 10"

echo ----------------------------------------
echo.

REM Vérifier si la ligne 2 contient "enabledelayedexpansion"
findstr /n "enabledelayedexpansion" START-AUTO.bat >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [OK] Le fichier contient "enabledelayedexpansion"
    echo.
    echo Ligne(s) contenant enabledelayedexpansion:
    findstr /n "enabledelayedexpansion" START-AUTO.bat
) else (
    echo [ERREUR] Le fichier NE CONTIENT PAS "enabledelayedexpansion"
    echo.
    echo SOLUTION: Supprimez START-AUTO.bat et re-telechargez depuis GitHub
)

echo.
echo ----------------------------------------
echo.

REM Vérifier l'encodage du fichier
for %%A in (START-AUTO.bat) do (
    echo Taille du fichier: %%~zA octets
    echo Date de modification: %%~tA
)

echo.
pause
