import { verifyKey, InteractionType, InteractionResponseType } from 'discord-interactions';

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  
  if (!signature || !timestamp) {
    return new Response('Missing signature', { status: 401 });
  }

  const body = await request.clone().text();

  if (!env.DISCORD_PUBLIC_KEY) {
    return new Response('Server missing public key (DISCORD_PUBLIC_KEY not set)', { status: 500 });
  }

  const isValidRequest = verifyKey(
    body,
    signature,
    timestamp,
    env.DISCORD_PUBLIC_KEY
  );

  if (!isValidRequest) {
    return new Response('Bad request signature', { status: 401 });
  }

  const interaction = JSON.parse(body);

  // 1. Handle Discord's initial Ping verification
  if (interaction.type === InteractionType.PING) {
    return new Response(JSON.stringify({ type: InteractionResponseType.PONG }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  // 2. Handle Slash Commands
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { name } = interaction.data;

    if (name === 'socials') {
      return new Response(JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Here are my official links!\n📺 YouTube: <https://youtube.com/@arashyt>\n👾 Twitch: <https://twitch.tv/ArashLIVE>\n💬 Discord: <https://discord.com/invite/GXAbp4y>'
        }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (name === 'latest') {
       return new Response(JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Check out my newest content live right now at <https://arashyt.ca>!'
        }
      }), { headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response('Unknown command', { status: 400 });
}
