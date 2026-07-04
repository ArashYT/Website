export async function onRequest(context: any) {
  const { env } = context;
  const apiKey = env.YOUTUBE_API_KEY;
  const channelId = 'UCaAKZpNsTNB3hjWpROvL_ug'; // ArashYT Channel ID

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing YouTube API Key", video: null }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 1. Fetch latest 5 videos
    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&order=date&maxResults=5&type=video`);
    const searchData = await searchRes.json() as any;
    
    if (!searchData.items || searchData.items.length === 0) {
      return new Response(JSON.stringify({ video: null }), { headers: { 'Content-Type': 'application/json' } });
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    // 2. Fetch video details to check if they were live streams
    const vidRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet,liveStreamingDetails`);
    const vidData = await vidRes.json() as any;

    // 3. Filter out videos that have liveStreamingDetails (meaning they are/were livestreams)
    const normalVideos = vidData.items.filter((item: any) => !item.liveStreamingDetails);
    
    // Fallback to the newest item if somehow all 5 were streams
    const video = normalVideos.length > 0 ? { id: { videoId: normalVideos[0].id } } : searchData.items[0];

    return new Response(JSON.stringify({ video }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, video: null }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
