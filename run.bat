@echo off
title Servidor WFR + Ngrok

:: Set console text color to green
color 0a
echo.
echo.
echo    Please insert the IP of the server:
echo.
echo.
echo.

:: Prompt user for IP address and store in variable
set /p _serverIP=ip: 

:: Save the IP address to ip.txt without a newline
<nul set /p= %_serverIP% > ip.txt

:: 1. Start Node.js server in the background (no new window)
start /B node server.js

:: 2. Wait 5 seconds for the server to start
timeout /t 5 >nul

:: 3. Start Ngrok and display the public URL
echo Iniciando Ngrok... (URL pública será exibida abaixo)
ngrok http 16082

pause
