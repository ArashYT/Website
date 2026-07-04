export async function onRequest(context: any) {
  const { env } = context;
  const clientId = env.TWITCH_CLIENT_ID;
  const clientSecret = env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(JSON.stringify({ error: "Missing Twitch credentials", isLive: false, clips: [] }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 1. Get App Access Token
    const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: 'POST' });
    const tokenData = await tokenRes.json() as any;
    const token = tokenData.access_token;

    // 2. Get User ID for ArashLIVE
    const userRes = await fetch('https://api.twitch.tv/helix/users?login=ArashLIVE', {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const userData = await userRes.json() as any;
    const userId = userData.data[0]?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User not found", isLive: false, clips: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Get Live Status
    const streamRes = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const streamData = await streamRes.json() as any;
    const isLive = streamData.data && streamData.data.length > 0;

    // 4. Get Top Clips (last 30 days)
    const startedAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const clipsRes = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${userId}&first=3&started_at=${startedAt}`, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const clipsData = await clipsRes.json() as any;

    return new Response(JSON.stringify({ isLive, clips: clipsData.data || [] }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, isLive: false, clips: [] }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
