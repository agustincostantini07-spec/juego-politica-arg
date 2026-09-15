@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js 24 y vuelve a abrir este archivo.
  pause
  exit /b 1
)
if not exist .env copy .env.example .env >nul
call npm ci --omit=dev --ignore-scripts
if errorlevel 1 goto error
call npm run build
if errorlevel 1 goto error
echo.
echo Abri http://localhost:3000 en tu navegador.
echo Deja esta ventana abierta mientras juegan.
echo.
call npm start
pause
exit /b
:error
echo No se pudo iniciar. Revisa el mensaje anterior y tu conexion a Internet.
pause
exit /b 1
