const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const startupPath = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
const shortcutPath = path.join(startupPath, 'ValorantSkinSync.lnk');
const targetPath = path.join(__dirname, 'launcher.vbs');

console.log('Installing Valorant Skin Sync to Windows Startup...');
console.log(`Startup Folder: ${startupPath}`);

try {
  // Escaping single quotes in PowerShell command
  const escapedShortcut = shortcutPath.replace(/'/g, "''");
  const escapedTarget = targetPath.replace(/'/g, "''");
  const escapedDir = __dirname.replace(/'/g, "''");

  const psCommand = `$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('${escapedShortcut}'); $Shortcut.TargetPath = '${escapedTarget}'; $Shortcut.WorkingDirectory = '${escapedDir}'; $Shortcut.Save();`;
  execSync(`powershell -Command "${psCommand}"`);
  console.log('Installation successful! The script is now configured to start automatically on Windows boot.');
} catch (err) {
  console.error('Failed to create startup shortcut:', err.message);
}
