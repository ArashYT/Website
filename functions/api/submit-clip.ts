export async function onRequestPost(context: any) {
  const { request, env } = context;
  const token = env.DISCORD_BOT_TOKEN;
  
  if (!token) {
    return new Response("Missing bot token", { status: 500 });
  }
  
  try {
    const formData = await request.formData();
    const url = formData.get("url");
    const comment = formData.get("comment");
    const username = formData.get("username") || "Anonymous";
    
    const message = {
      content: `🎬 **New Clip Submitted via Website!**\n**From:** ${username}\n**URL:** ${url}\n**Comment:** ${comment || 'No comment'}`
    };
    
    // Discord Channel ID for 🎬stream-clips
    const channelId = '1314445609062633492';
    
    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
    
    const reqUrl = new URL(request.url);
    return Response.redirect(`${reqUrl.origin}/clips?success=1`, 303);
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}
