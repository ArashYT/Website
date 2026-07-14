// Valorant Local Loadout Sync Script
// This script runs silently in the background, queries your local Valorant game client,
// and automatically syncs your equipped skins to your public website.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Allow self-signed SSL for local client

const fs = require('fs');
const path = require('path');

const WEBSITE_URL = 'https://arashyt.ca';
const ACCESS_CODE = 'Arash1382!';

const WEAPONS = {
  vandal: '9c86d8be-4fb6-ac4c-4024-e0a977d612d4',
  phantom: 'ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a',
  operator: 'a03b24d3-4a19-737e-4d5d-9ff5a6cfb520',
  melee: '2f59173c-4ecc-e840-1123-698d415041a8',
  sheriff: 'e33a52b6-455b-29a8-cc43-09413287db68'
};

const localAppData = process.env.LOCALAPPDATA;
const lockfilePath = path.join(localAppData, 'Riot Games', 'Riot Client', 'Config', 'lockfile');

let skinsMap = {};
let lastSyncedSkins = {};

// 1. Fetch public skins catalog once on startup
async function initSkinsMap() {
  console.log('Fetching Valorant skins catalog...');
  try {
    const res = await fetch('https://valorant-api.com/v1/weapons/skins');
    const data = await res.json();
    if (data && data.data) {
      data.data.forEach(skin => {
        skinsMap[skin.uuid.toLowerCase()] = skin.displayName;
      });
      console.log(`Loaded ${Object.keys(skinsMap).length} skins from Valorant API.`);
      return true;
    }
  } catch (err) {
    console.error('Failed to load skins catalog:', err.message);
  }
  return false;
}

// 2. Fetch current in-game equipped loadout
async function getLocalLoadout(port, password) {
  const auth = Buffer.from(`riot:${password}`).toString('base64');
  const headers = { 'Authorization': `Basic ${auth}` };

  // Fetch local session info to get player PUUID
  const sessionRes = await fetch(`https://127.0.0.1:${port}/chat/v1/session`, { headers });
  if (!sessionRes.ok) throw new Error('Failed to get chat session');
  const session = await sessionRes.json();
  const puuid = session.puuid;

  if (!puuid) throw new Error('Player PUUID not found in session');

  // Fetch player loadout
  const loadoutRes = await fetch(`https://127.0.0.1:${port}/personalization/v2/players/${puuid}/playerloadout`, { headers });
  if (loadoutRes.status === 404) {
    throw new Error('Valorant lobby inactive');
  }
  if (!loadoutRes.ok) throw new Error('Failed to get player loadout');
  const loadout = await loadoutRes.json();

  const activeSkins = {};
  if (loadout && loadout.Guns) {
    loadout.Guns.forEach(slot => {
      const weaponKey = Object.keys(WEAPONS).find(k => WEAPONS[k] === slot.ID);
      if (weaponKey && slot.SkinID) {
        const skinName = skinsMap[slot.SkinID.toLowerCase()] || 'Default Skin';
        activeSkins[weaponKey] = skinName;
      }
    });
  }

  return activeSkins;
}

// 3. Sync loadout to the Cloudflare production database
async function syncToWebsite(newSkins) {
  console.log('Skins changed! Syncing to website...', newSkins);
  try {
    // A. Fetch current configuration settings
    const getRes = await fetch(`${WEBSITE_URL}/api/settings`);
    if (!getRes.ok) throw new Error('Failed to fetch website settings');
    const config = await getRes.json();

    if (!config.valorant) {
      config.valorant = {};
    }
    config.valorant.skins = newSkins;

    // B. Post updated config with the password
    const postRes = await fetch(`${WEBSITE_URL}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: config, password: ACCESS_CODE })
    });
    const postData = await postRes.json();

    if (postData.success) {
      console.log('Successfully synced loadout to production website!');
      lastSyncedSkins = { ...newSkins };
      return true;
    } else {
      console.error('Server failed to save settings:', postData.error);
    }
  } catch (err) {
    console.error('Sync request failed:', err.message);
  }
  return false;
}

// Main Polling Loop
async function main() {
  const initialized = await initSkinsMap();
  if (!initialized) {
    console.log('Retry loading catalog in 10 seconds...');
    setTimeout(main, 10000);
    return;
  }

  console.log('Sync service started. Monitoring Valorant...');

  while (true) {
    try {
      if (fs.existsSync(lockfilePath)) {
        const content = fs.readFileSync(lockfilePath, 'utf-8');
        const [name, pid, port, password, protocol] = content.split(':');

        if (port && password) {
          const activeSkins = await getLocalLoadout(port, password);

          // Compare with last synced in memory
          const hasChanged = Object.keys(WEAPONS).some(k => activeSkins[k] !== lastSyncedSkins[k]);
          if (hasChanged) {
            await syncToWebsite(activeSkins);
          }
        }
      } else {
        // Valorant is not running
        if (Object.keys(lastSyncedSkins).length > 0) {
          console.log('Valorant closed. Monitoring...');
          lastSyncedSkins = {}; // reset cache
        }
      }
    } catch (err) {
      const errMsg = err.message || String(err);
      if (errMsg.includes('chat session') || errMsg.includes('player loadout') || errMsg.includes('lobby inactive') || errMsg.includes('ECONNREFUSED')) {
        console.log('Monitoring: Riot Client launcher is open. Waiting for Valorant game lobby...');
      } else {
        console.log('Monitor check failed:', errMsg);
      }
    }

    // Wait 30 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
}

main();
