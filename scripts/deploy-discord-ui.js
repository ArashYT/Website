const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
        const guild = client.guilds.cache.first();
        await guild.channels.fetch();
        await guild.roles.fetch();
        
        const channel = guild.channels.cache.find(c => c.name === '✅roles');
        if (!channel) throw new Error("Could not find ✅roles channel");

        // Helper to get or create role
        async function getOrCreateRole(name, color = 0x95a5a6) {
            let role = guild.roles.cache.find(r => r.name === name);
            if (!role) {
                role = await guild.roles.create({ name, color });
                console.log(`Created role: ${name}`);
            }
            return role.id;
        }

        // 1. Games Roles
        const games = ['Valorant', 'Minecraft', 'Fortnite', 'Apex Legends', 'CS2', 'Overwatch', 'Rocket League', 'GTA V'];
        const gameOptions = [];
        for (const game of games) {
            const id = await getOrCreateRole(game, 0xe74c3c);
            gameOptions.push({ label: game, value: id, description: `Get pings for ${game}` });
        }

        const rowGames = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('role_select_games').setPlaceholder('🎮 What games do you play?').addOptions(gameOptions)
        );

        // 2. Gender Roles (Use existing if possible)
        const genderOptions = [
            { label: 'Male', value: await getOrCreateRole('🚹Male', 0x3498db), emoji: '🚹' },
            { label: 'Female', value: await getOrCreateRole('🚺Female', 0xe91e63), emoji: '🚺' },
            { label: 'Other', value: await getOrCreateRole('❓Other', 0x9b59b6), emoji: '❓' }
        ];

        const rowGender = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('role_select_gender').setPlaceholder('👤 Select your Gender').addOptions(genderOptions)
        );

        // 3. Hobbies Roles
        const hobbies = ['Anime', 'Music', 'Coding', 'Sports', 'Art', 'Movies'];
        const hobbyOptions = [];
        for (const hobby of hobbies) {
            const id = await getOrCreateRole(hobby, 0xf1c40f);
            hobbyOptions.push({ label: hobby, value: id });
        }

        const rowHobbies = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('role_select_hobbies').setPlaceholder('🎨 What are your hobbies?').addOptions(hobbyOptions)
        );

        // 4. Age Button (Triggers Modal in the Cloudflare Worker backend)
        const rowAge = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('role_btn_age').setLabel('Set Your Exact Age').setStyle(ButtonStyle.Primary).setEmoji('🎂')
        );

        const embed = new EmbedBuilder()
            .setTitle('🎭 Self-Assignable Roles')
            .setDescription('Customize your profile! Use the dropdowns below to select your Games, Gender, and Hobbies.\n\nClick the **Set Your Exact Age** button to type your age, and the bot will automatically generate and assign you a custom Age role!')
            .setColor(0xff0050)
            .setImage('https://arashyt.ca/banner.jpg'); // Assuming we want a banner

        await channel.send({ embeds: [embed], components: [rowGames, rowGender, rowHobbies, rowAge] });
        
        console.log("Successfully posted Discord UI to ✅roles");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
