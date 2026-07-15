export async function onRequestGet(context: any) {
  const db = context.env.ARASH_DB;
  
  try {
    let settingsStr = await db.get('site_settings');
    let settings = null;
    
    if (settingsStr) {
      settings = JSON.parse(settingsStr);
    } else {
      // Return default configuration if none is set in the database yet
      settings = {
        theme: {
          defaultTheme: 'dark',
          accentColor: '#ff4655'
        },
        twitch: {
          channel: 'ArashLIVE',
          showChat: true
        },
        twitter: {
          username: 'arashyt',
          enabled: true
        },
        valorant: {
          riotId: 'TTV ArashLIVE#LWPxD',
          apiKey: 'HDEV-4b453d1c-41b0-478f-afa5-ff2e2e56067f',
          enabled: true
        },
        minecraft: {
          serverIp: 'mc.arashyt.ca',
          enabled: false
        },
        adsense: {
          enabled: false,
          publisherId: '',
          adSlotId: ''
        },
        randomClip: {
          enabled: false
        },
        contactForm: {
          enabled: false
        },
        schedule: {
          enabled: false,
          days: [
            { day: 'Mon', time: '8 PM EST', game: 'Valorant' },
            { day: 'Wed', time: '8 PM EST', game: 'Valorant' },
            { day: 'Fri', time: '9 PM EST', game: 'Variety' }
          ]
        },
        soundboard: {
          enabled: false
        },
        socials: {
          youtube: 'https://youtube.com/@arashyt',
          twitch: 'https://twitch.tv/ArashLIVE',
          discord: 'https://discord.com/invite/GXAbp4y',
          tiktok: 'https://tiktok.com/@arashyt',
          instagram: 'https://instagram.com/arashyt',
          x: 'https://x.com/arashyt'
        }
      };
      await db.put('site_settings', JSON.stringify(settings));
    }

    // Omit sensitive API Key for general public request
    const publicSettings = JSON.parse(JSON.stringify(settings));
    if (publicSettings.valorant) {
      // Just return a masked version of the key to the public
      publicSettings.valorant.apiKey = publicSettings.valorant.apiKey ? "••••••••••••" : "";
    }

    return new Response(JSON.stringify(publicSettings), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=10' // 10s caching for performance
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context: any) {
  const db = context.env.ARASH_DB;
  
  try {
    const { settings, password, newPassword } = await context.request.json();
    
    // Check Authorization
    let storedPassword = await db.get('admin_password');
    if (!storedPassword) {
      storedPassword = 'admin'; // default password
      await db.put('admin_password', storedPassword);
    }
    
    if (password !== storedPassword) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized access code." }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle changing the access code
    if (newPassword) {
      await db.put('admin_password', newPassword);
      return new Response(JSON.stringify({ success: true, message: "Access code changed successfully." }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!settings || Object.keys(settings).length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Settings payload missing." }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If API key was masked in payload, do not overwrite the original key in database
    let existingSettingsStr = await db.get('site_settings');
    if (existingSettingsStr) {
      const existingSettings = JSON.parse(existingSettingsStr);
      if (settings.valorant && settings.valorant.apiKey === "••••••••••••") {
        settings.valorant.apiKey = existingSettings.valorant?.apiKey || "";
      }
    }

    // Save settings to KV database
    await db.put('site_settings', JSON.stringify(settings));

    // Also update sub-settings in KV for the older /api/valorant endpoint to read
    if (settings.valorant?.riotId) {
      await db.put('valorant_riot_id', settings.valorant.riotId);
    }
    if (settings.valorant?.apiKey && settings.valorant.apiKey !== "••••••••••••") {
      await db.put('valorant_api_key', settings.valorant.apiKey);
    }

    return new Response(JSON.stringify({ success: true, message: "Settings saved successfully." }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
