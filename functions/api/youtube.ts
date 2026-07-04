export async function onRequest(context: any) {
  const { env } = context;
  const apiKey = env.YOUTUBE_API_KEY;
  const uploadsPlaylistId = 'UUaAKZpNsTNB3hjWpROvL_ug'; // ArashYT Uploads Playlist

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing YouTube API Key", video: null }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 1. Fetch latest 10 items from the Uploads playlist
    const plRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=contentDetails&maxResults=10`);
    const plData = await plRes.json() as any;
    
    if (!plData.items || plData.items.length === 0) {
      return new Response(JSON.stringify({ video: null }), { headers: { 'Content-Type': 'application/json' } });
    }

    const videoIds = plData.items.map((item: any) => item.contentDetails.videoId).join(',');

    // 2. Fetch video details to check if they were live streams
    const vidRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet,liveStreamingDetails`);
    const vidData = await vidRes.json() as any;

    // 3. Filter out videos that have liveStreamingDetails (meaning they are/were livestreams)
    const normalVideos = vidData.items.filter((item: any) => !item.liveStreamingDetails);
    
    // Fallback to the newest item if somehow all 10 were streams
    const videoId = normalVideos.length > 0 ? normalVideos[0].id : plData.items[0].contentDetails.videoId;

    return new Response(JSON.stringify({ video: { id: { videoId } } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, video: null }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
