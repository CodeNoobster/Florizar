@echo off
REM ============================================
REM Test de delayed expansion
REM Ce script teste si !VAR! fonctionne correctement
REM ============================================

echo.
echo ========================================
echo   TEST DE DELAYED EXPANSION
echo ========================================
echo.

REM Test 1 - SANS enabledelayedexpansion
cd /d "%~dp0"
echo TEST 1 - SANS enabledelayedexpansion:
echo   Avec percent: %CD%
echo   Avec exclamation: !CD!
echo.

REM Test 2 - AVEC enabledelayedexpansion
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo TEST 2 - AVEC enabledelayedexpansion:
echo   Avec percent: %CD%
echo   Avec exclamation: !CD!
echo.

REM Test 3 - ERRORLEVEL dans une boucle
echo TEST 3 - Test ERRORLEVEL:
set TEST_VAR=initial
if 1==1 (
    set TEST_VAR=modifie
    echo   Avec percent: TEST_VAR=%TEST_VAR%
    echo   Avec exclamation: TEST_VAR=!TEST_VAR!
)
echo.

echo ========================================
echo   RESULTATS ATTENDUS:
echo ========================================
echo.
echo TEST 1:
echo   - Avec percent: doit montrer le chemin
echo   - Avec exclamation: doit montrer !CD! (literal)
echo.
echo TEST 2:
echo   - Avec percent: doit montrer le chemin
echo   - Avec exclamation: doit montrer le chemin (PAS literal !)
echo.
echo TEST 3:
echo   - Avec percent: TEST_VAR=initial
echo   - Avec exclamation: TEST_VAR=modifie
echo.
echo Si TEST 2 et TEST 3 montrent les valeurs INCORRECTES,
echo alors delayed expansion NE FONCTIONNE PAS sur votre systeme.
echo.
echo Cela peut etre du a:
echo - Version de Windows trop ancienne
echo - Registre Windows modifie
echo - Securite ou strategie de groupe
echo.

pause
