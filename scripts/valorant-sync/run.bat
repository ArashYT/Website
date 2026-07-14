@echo off
title Valorant Loadout Auto-Sync Setup
cd /d "%~dp0"
echo ===================================================
echo   Valorant Loadout Auto-Sync Installer & Starter
echo ===================================================
echo.
echo Installing startup shortcut...
node install-startup.js
echo.
echo Starting the background synchronization service...
wscript.exe launcher.vbs
echo.
echo ===================================================
echo   Success! Service is now running silently in
echo   the background. You can close this window.
echo ===================================================
echo.
pause
