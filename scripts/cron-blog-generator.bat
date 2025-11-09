@echo off
REM Blog Auto-Generator Windows Task Script
REM Questo script viene eseguito da Task Scheduler per generare automaticamente articoli

REM Naviga nella directory del progetto
cd /d "%~dp0\.."

REM Crea directory logs se non esisteva
if not exist "logs" mkdir logs

REM File di log
set LOG_FILE=logs\blog-auto-generator.log

REM Funzione di logging (simulata in batch)
echo [%date% %time%] Starting blog auto-generation... >> %LOG_FILE%

REM Ottieni il giorno della settimana (1=Monday, 7=Sunday)
for /f "tokens=1" %%i in ('powershell -Command "Get-Date -Format 'u'"') do set CURRENT_DAY=%%i

REM Giorni di pubblicazione: 1,3,5 (Lunedì, Mercoledì, Venerdì)
set PUBLISH_DAYS=1,3,5

REM Controlla se oggi è un giorno di pubblicazione
echo %PUBLISH_DAYS% | findstr /C:%CURRENT_DAY% >nul
if %errorlevel% equ 0 (
    echo [%date% %time%] Today is a publish day ^(day %CURRENT_DAY%^) >> %LOG_FILE%
    
    REM Ottieni l'ora corrente
    for /f "tokens=1-2 delims=:" %%a in ('time /t') do set CURRENT_HOUR=%%a& set CURRENT_MIN=%%b
    set CURRENT_TIME=%CURRENT_HOUR%:%CURRENT_MIN%
    
    REM Orario di pubblicazione
    set PUBLISH_TIME=09:30
    set PUBLISH_TIME_ALT=9:30
    
    REM Controlla l'orario (con varianti per formato 24h e 12h)
    if "%CURRENT_TIME%"=="%PUBLISH_TIME%" goto GENERATE
    if "%CURRENT_TIME%"=="%PUBLISH_TIME_ALT%" goto GENERATE
    
    echo [%date% %time%] Not publish time yet. Current: %CURRENT_TIME%, Publish: %PUBLISH_TIME% >> %LOG_FILE%
    goto END
    
    :GENERATE
    echo [%date% %time%] It's publish time! Generating new blog post... >> %LOG_FILE%
    
    REM Esegui il generatore di blog
    node scripts\generate-blog-post.js >> %LOG_FILE% 2>&1
    
    if %errorlevel% equ 0 (
        echo [%date% %time%] Blog post generated successfully! >> %LOG_FILE%
    ) else (
        echo [%date% %time%] ERROR: Failed to generate blog post >> %LOG_FILE%
    )
    
) else (
    echo [%date% %time%] Today is not a publish day ^(day %CURRENT_DAY%^) >> %LOG_FILE%
)

:END
echo [%date% %time%] Blog auto-generation check completed >> %LOG_FILE%