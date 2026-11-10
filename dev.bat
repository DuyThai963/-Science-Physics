@echo off
title Science - Physics Dev Environment
echo ========================================================
echo   Science - Physics Dev Server
echo ========================================================
echo.
echo 1. Dang khoi dong Backend API tai http://localhost:5001 ...
start "Science-Physics Backend" cmd /k "node server.js"
echo.
echo 2. Cho 2 giay de Backend san sang...
timeout /t 2 /nobreak >nul
echo.
echo 3. Dang khoi dong Vite Frontend tai http://localhost:3000 ...
start "Science-Physics Frontend" cmd /k "npm run dev"
