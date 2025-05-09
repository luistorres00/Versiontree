@echo off
title Servidor WFR + Ngrok

:: 1. Iniciar servidor Node.js em segundo plano (sem nova janela)
start /B node server.js

:: 2. Esperar 5 segundos (para o servidor iniciar)
timeout /t 5 >nul

:: 3. Iniciar Ngrok em segundo plano e mostrar URL
echo Iniciando Ngrok... (URL pública será exibida abaixo)
ngrok http 16082

pause