export async function onRequestGet(context: any) {
  const db = context.env.ARASH_DB;
  
  // 1. Retrieve the Riot ID from KV
  let riotId = await db.get('valorant_riot_id');
  if (!riotId) {
    riotId = "TTV ArashLIVE#LWPxD";
    await db.put('valorant_riot_id', riotId);
  }

  // 2. Retrieve the API Key from KV
  let apiKey = await db.get('valorant_api_key');
  if (!apiKey) {
    apiKey = "HDEV-4b453d1c-41b0-478f-afa5-ff2e2e56067f";
    await db.put('valorant_api_key', apiKey);
  }

  const parts = riotId.split('#');
  const name = parts[0] || 'TTV ArashLIVE';
  const tag = parts[1] || 'LWPxD';
  const region = 'na';

  try {
    // Run three requests concurrently at the edge to optimize speed
    const [mmrRes, matchesRes, accountRes] = await Promise.all([
      fetch(`https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
        headers: { "Authorization": apiKey }
      }),
      fetch(`https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=3`, {
        headers: { "Authorization": apiKey }
      }),
      fetch(`https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
        headers: { "Authorization": apiKey }
      })
    ]);

    let mmrData: any = {};
    if (mmrRes.ok) {
      const data = await mmrRes.json();
      if (data.status === 200 && data.data) {
        mmrData = data.data;
      }
    }

    let accountLevel = 751;
    let cardIcon = null;
    if (accountRes.ok) {
      const data = await accountRes.json();
      if (data.status === 200 && data.data) {
        accountLevel = data.data.account_level ?? 751;
        cardIcon = data.data.card?.small || null;
      }
    }

    let matchesData = [];
    if (matchesRes.ok) {
      const mData = await matchesRes.json();
      if (mData.status === 200 && mData.data) {
        matchesData = mData.data.map((m: any) => {
          const player = m.players?.all_players?.find((p: any) => p.name === name);
          if (!player) return null;
          const playerTeam = player.team?.toLowerCase() || 'blue'; // 'blue' or 'red'
          const opponentTeam = playerTeam === 'blue' ? 'red' : 'blue';
          
          const won = m.teams?.[playerTeam]?.has_won ?? false;
          const playerRounds = m.teams?.[playerTeam]?.rounds_won ?? 0;
          const opponentRounds = m.teams?.[opponentTeam]?.rounds_won ?? 0;
          
          // Emojis mapping
          const agentEmojis: Record<string, string> = {
            'Jett': '🌪️', 'Reyna': '🔮', 'Yoru': '🦊', 'Omen': '👻', 'Raze': '💣',
            'Sage': '🩹', 'Phoenix': '🔥', 'Killjoy': '🛠️', 'Cypher': '🕵️', 'Sova': '🏹',
            'Breach': '💥', 'Brimstone': '☄️', 'Skye': '🌿', 'Astra': '✨', 'KAY/O': '🤖',
            'Chamber': '👓', 'Neon': '⚡', 'Fade': '👁️', 'Harbor': '🌊', 'Gekko': '🦎',
            'Deadlock': '🕸️', 'Iso': '🛡️', 'Clove': '🦋', 'Vyse': '🌹'
          };
          const agentEmoji = agentEmojis[player.character] || '👤';

          // Calculate headshot accuracy
          const hs = player.stats?.headshots ?? 0;
          const bs = player.stats?.bodyshots ?? 0;
          const ls = player.stats?.legshots ?? 0;
          const totalHits = hs + bs + ls;
          const hsPercent = totalHits > 0 ? Math.round((hs / totalHits) * 100) : 0;

          // Format clean date string (e.g. "Tuesday, July 14")
          let dateStr = 'Recently';
          if (m.metadata?.game_start_patched) {
            const dateParts = m.metadata.game_start_patched.split(',');
            if (dateParts.length >= 2) {
              dateStr = dateParts[0] + ',' + dateParts[1];
            }
          }

          return {
            map: m.metadata?.map || 'Lotus',
            mode: m.metadata?.mode || 'Competitive',
            agent: player.character,
            agentEmoji,
            kills: player.stats?.kills ?? 0,
            deaths: player.stats?.deaths ?? 0,
            assists: player.stats?.assists ?? 0,
            score: player.stats?.score ?? 0,
            won,
            teamScore: `${playerRounds}-${opponentRounds}`,
            hsPercent,
            date: dateStr
          };
        }).filter(Boolean);
      }
    }

    if (mmrData.current_data) {
      return new Response(JSON.stringify({
        success: true,
        riotId,
        accountLevel,
        cardIcon,
        rankName: mmrData.current_data.currenttierpatched || "Silver 2",
        rankRating: mmrData.current_data.ranking_in_tier ?? 0,
        elo: mmrData.current_data.elo ?? 700,
        rankIcon: mmrData.current_data.images?.small || null,
        region: region.toUpperCase() + " East",
        isActive: true,
        matches: matchesData
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=120' // cache for 2 minutes to prevent API spam
        }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: "Riot profile data could not be fetched. Check spelling.",
        riotId,
        accountLevel: 751,
        cardIcon: null,
        rankName: "Silver 2",
        rankRating: 0,
        elo: 700,
        rankIcon: null,
        region: "NA East",
        isActive: false,
        matches: []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
      riotId,
      accountLevel: 751,
      cardIcon: null,
      rankName: "Silver 2",
      rankRating: 0,
      elo: 700,
      rankIcon: null,
      region: "NA East",
      isActive: false,
      matches: []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Allow setting settings via POST
export async function onRequestPost(context: any) {
  const db = context.env.ARASH_DB;
  try {
    const { riotId, apiKey } = await context.request.json();
    if (riotId) {
      await db.put('valorant_riot_id', riotId);
    }
    if (apiKey) {
      await db.put('valorant_api_key', apiKey);
    }
    return new Response(JSON.stringify({ success: true, message: "Settings updated successfully." }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
