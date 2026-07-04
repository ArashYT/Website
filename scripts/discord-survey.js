const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guilds = client.guilds.cache.map(g => g);
    if (guilds.length === 0) {
        console.log("Bot is not in any servers.");
        process.exit(1);
    }
    
    const guild = guilds[0]; 
    await guild.channels.fetch();
    await guild.roles.fetch();
    
    // Sort channels by position
    const allChannels = Array.from(guild.channels.cache.values()).sort((a, b) => a.position - b.position);
    
    const layout = {
        serverName: guild.name,
        memberCount: guild.memberCount,
        roles: guild.roles.cache.map(r => r.name),
        categories: {}
    };

    // Initialize categories
    const categories = allChannels.filter(c => c.type === ChannelType.GuildCategory);
    for (const cat of categories) {
        layout.categories[cat.name] = [];
    }
    layout.categories['NO_CATEGORY'] = [];

    // Assign channels to categories
    for (const c of allChannels) {
        if (c.type === ChannelType.GuildCategory) continue;
        
        let typeStr = 'Text';
        if (c.type === ChannelType.GuildVoice) typeStr = 'Voice';
        else if (c.type === ChannelType.GuildAnnouncement) typeStr = 'Announcement';
        else if (c.type === ChannelType.GuildForum) typeStr = 'Forum';
        
        const channelData = `${c.name} (${typeStr})`;
        
        if (c.parent && layout.categories[c.parent.name]) {
            layout.categories[c.parent.name].push(channelData);
        } else {
            layout.categories['NO_CATEGORY'].push(channelData);
        }
    }
    
    fs.writeFileSync('discord-layout.json', JSON.stringify(layout, null, 2));
    console.log("Successfully dumped layout to discord-layout.json");
    process.exit(0);
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
