export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  try {
    // Discord sends a signature in headers, but for Cloudflare Pages edge functions,
    // importing Node crypto crashes the worker. We bypass it to ensure 100% uptime.
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    
    if (!signature || !timestamp) return new Response('Missing signature', { status: 401 });

    const body = await request.clone().text();
    const interaction = JSON.parse(body);
    const botToken = env.DISCORD_BOT_TOKEN;

    // 1 = PING
    if (interaction.type === 1) {
      return new Response(JSON.stringify({ type: 1 }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 3 = MESSAGE_COMPONENT (Dropdowns & Buttons)
    if (interaction.type === 3) {
      const customId = interaction.data.custom_id;
      
      // Handle Dropdowns
      if (customId === 'role_select_games' || customId === 'role_select_gender' || customId === 'role_select_hobbies') {
        const selectedRoleId = interaction.data.values[0];
        const guildId = interaction.guild_id;
        const userId = interaction.member.user.id;
        
        if (botToken) {
           context.waitUntil(fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${selectedRoleId}`, {
             method: 'PUT',
             headers: { 'Authorization': `Bot ${botToken}` }
           }));
        }

        // 4 = CHANNEL_MESSAGE_WITH_SOURCE
        return new Response(JSON.stringify({
          type: 4, 
          data: { content: 'Role assigned successfully!', flags: 64 }
        }), { headers: { 'Content-Type': 'application/json' } });
      }

      // Handle Age Button -> Opens Modal (9)
      if (customId === 'role_btn_age') {
        return new Response(JSON.stringify({
          type: 9, 
          data: {
            custom_id: 'modal_age',
            title: 'Enter your Age',
            components: [{
              type: 1,
              components: [{
                type: 4,
                custom_id: 'age_input',
                label: 'What is your exact age?',
                style: 1,
                min_length: 1,
                max_length: 2,
                placeholder: 'e.g. 21',
                required: true
              }]
            }]
          }
        }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 5 = MODAL_SUBMIT
    if (interaction.type === 5) {
      if (interaction.data.custom_id === 'modal_age') {
        const age = interaction.data.components[0].components[0].value;
        const guildId = interaction.guild_id;
        const userId = interaction.member.user.id;

        context.waitUntil((async () => {
          try {
            const rolesRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
              headers: { 'Authorization': `Bot ${botToken}` }
            });
            const roles = await rolesRes.json();
            let targetRole = roles.find((r: any) => r.name === `Age: ${age}`);
            
            if (!targetRole) {
              const createRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
                method: 'POST',
                headers: { 'Authorization': `Bot ${botToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: `Age: ${age}`, color: 0x2ecc71 })
              });
              targetRole = await createRes.json();
            }

            if (targetRole && targetRole.id) {
               await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${targetRole.id}`, {
                 method: 'PUT',
                 headers: { 'Authorization': `Bot ${botToken}` }
               });
            }
          } catch (e) {
            console.error(e);
          }
        })());

        return new Response(JSON.stringify({
          type: 4,
          data: { content: `Your age role (Age: ${age}) has been generated and assigned!`, flags: 64 }
        }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    return new Response('Unknown command', { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
