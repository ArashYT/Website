# Valorant Weapon Skins Auto-Sync Service

This is a lightweight, zero-interaction background utility that automatically queries your local Valorant game client and synchronizes your active equipped skins to your public website portfolio in real-time.

## How it works
1. **Lightweight Monitoring**: The script monitors if Valorant is running. While offline, it consumes 0.0% CPU.
2. **Lockfile Authentication**: When you launch Valorant, it securely reads the local temporary lockfile to authenticate with your active local game client session.
3. **Equipped Locker Matching**: It fetches your currently equipped loadout UUIDs and matches them against the official Valorant game assets API to find the names of your Vandal, Phantom, Operator, Knife, and Sheriff skins.
4. **Cloudflare KV Updates**: Whenever you change your skins in the game lobby, the script automatically sends a secure update to your website's database, updating the frontend icons instantly.

## Installation & Setup
1. Open the folder `scripts/valorant-sync` in your File Explorer.
2. Double-click the **`run.bat`** file.
3. Done! 

*The script will automatically register itself in your Windows Startup directory so it boots silently in the background whenever you turn on your PC. You never have to interact with it again!*

## How to stop/remove it
* **Stop the running service**: Open your Windows Task Manager, find `Node.js JavaScript Runtime` in the background processes, and select **End Task** (or run `taskkill /f /im node.exe`).
* **Remove from startup**: Press `Win + R`, type `shell:startup`, hit enter, and delete the `ValorantSkinSync` shortcut.
