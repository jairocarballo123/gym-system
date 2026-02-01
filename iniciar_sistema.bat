@echo off
echo Iniciando sistema de gimnasio...

REM Ir al directorio donde está este script
cd /d "%~dp0Backend"

docker compose up --build
pause
