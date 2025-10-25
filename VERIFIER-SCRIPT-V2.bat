@echo off
REM ============================================
REM Verification du contenu de START-AUTO.bat
REM Version 2 - Ecrit dans un fichier LOG
REM ============================================

set LOG_FILE=VERIFICATION-RESULTAT.txt

echo Verification en cours...
echo Les resultats seront sauvegardes dans: %LOG_FILE%
echo.

REM Créer le fichier de log
echo ======================================== > %LOG_FILE%
echo   VERIFICATION DE START-AUTO.bat >> %LOG_FILE%
echo   Date: %DATE% %TIME% >> %LOG_FILE%
echo ======================================== >> %LOG_FILE%
echo. >> %LOG_FILE%

if not exist "START-AUTO.bat" (
    echo ERREUR: START-AUTO.bat n'existe pas ! >> %LOG_FILE%
    echo Repertoire actuel: %CD% >> %LOG_FILE%
    echo. >> %LOG_FILE%
    echo ERREUR: START-AUTO.bat n'existe pas !
    notepad %LOG_FILE%
    pause
    exit /b 1
)

echo Fichier trouve: START-AUTO.bat >> %LOG_FILE%
echo. >> %LOG_FILE%

REM Taille et date du fichier
echo ---------------------------------------- >> %LOG_FILE%
echo INFORMATIONS SUR LE FICHIER: >> %LOG_FILE%
echo ---------------------------------------- >> %LOG_FILE%
for %%A in (START-AUTO.bat) do (
    echo Taille: %%~zA octets >> %LOG_FILE%
    echo Date de modification: %%~tA >> %LOG_FILE%
)
echo. >> %LOG_FILE%

REM Afficher les 15 premières lignes
echo ---------------------------------------- >> %LOG_FILE%
echo 15 PREMIERES LIGNES DU FICHIER: >> %LOG_FILE%
echo ---------------------------------------- >> %LOG_FILE%
powershell -Command "Get-Content 'START-AUTO.bat' | Select-Object -First 15" >> %LOG_FILE%
echo. >> %LOG_FILE%

REM Vérifier si "enabledelayedexpansion" est présent
echo ---------------------------------------- >> %LOG_FILE%
echo VERIFICATION DE enabledelayedexpansion: >> %LOG_FILE%
echo ---------------------------------------- >> %LOG_FILE%

findstr /n "enabledelayedexpansion" START-AUTO.bat >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [OK] Le fichier contient "enabledelayedexpansion" >> %LOG_FILE%
    echo. >> %LOG_FILE%
    echo Lignes contenant enabledelayedexpansion: >> %LOG_FILE%
    findstr /n "enabledelayedexpansion" START-AUTO.bat >> %LOG_FILE%
    echo. >> %LOG_FILE%
) else (
    echo [ERREUR] Le fichier NE CONTIENT PAS "enabledelayedexpansion" ! >> %LOG_FILE%
    echo. >> %LOG_FILE%
    echo SOLUTION: >> %LOG_FILE%
    echo 1. Supprimez START-AUTO.bat >> %LOG_FILE%
    echo 2. Re-telechargez depuis GitHub >> %LOG_FILE%
    echo. >> %LOG_FILE%
)

REM Vérifier la ligne 2 spécifiquement
echo ---------------------------------------- >> %LOG_FILE%
echo LIGNE 2 DU FICHIER (doit etre setlocal enabledelayedexpansion): >> %LOG_FILE%
echo ---------------------------------------- >> %LOG_FILE%
powershell -Command "Get-Content 'START-AUTO.bat' | Select-Object -Index 1" >> %LOG_FILE%
echo. >> %LOG_FILE%

REM Chercher les lignes avec !CD! ou !ERRORLEVEL!
echo ---------------------------------------- >> %LOG_FILE%
echo LIGNES UTILISANT !CD! OU !ERRORLEVEL!: >> %LOG_FILE%
echo ---------------------------------------- >> %LOG_FILE%
findstr /n "!CD!" START-AUTO.bat >> %LOG_FILE% 2>&1
findstr /n "!ERRORLEVEL!" START-AUTO.bat >> %LOG_FILE% 2>&1
echo. >> %LOG_FILE%

REM Vérifier s'il y a encore des %ERRORLEVEL% (devrait être remplacé par !)
echo ---------------------------------------- >> %LOG_FILE%
echo VERIFICATION DES %%ERRORLEVEL%% (ne devrait PAS exister): >> %LOG_FILE%
echo ---------------------------------------- >> %LOG_FILE%
findstr /n "%%ERRORLEVEL%%" START-AUTO.bat >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [ERREUR] Le fichier contient encore %%ERRORLEVEL%% ! >> %LOG_FILE%
    echo Ces lignes doivent utiliser !ERRORLEVEL! a la place: >> %LOG_FILE%
    findstr /n "%%ERRORLEVEL%%" START-AUTO.bat >> %LOG_FILE%
    echo. >> %LOG_FILE%
) else (
    echo [OK] Aucun %%ERRORLEVEL%% trouve (c'est correct) >> %LOG_FILE%
    echo. >> %LOG_FILE%
)

echo ======================================== >> %LOG_FILE%
echo   FIN DE LA VERIFICATION >> %LOG_FILE%
echo ======================================== >> %LOG_FILE%

echo.
echo Verification terminee !
echo Ouverture du fichier de resultats dans Notepad...
echo.

REM Ouvrir le fichier dans Notepad
notepad %LOG_FILE%

pause
