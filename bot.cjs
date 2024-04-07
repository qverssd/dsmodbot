const { Client, GatewayIntentBits, Intents } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});
const { TOKEN, PREFIX, MUTED_ROLE_ID } = require('./config.json');

client.once('ready', () => {
    console.log('Bot is ready');
});

client.on('messageCreate', async message => {
    if (!message.guild || message.author.bot) return;

    const wordsToFilter = ['выблядок', 'viblyadok', 'wiblyadok'];

    const containsFilteredWord = wordsToFilter.some(word => message.content.toLowerCase().includes(word.toLowerCase()));

    if (containsFilteredWord) {
        const mutedRole = message.guild.roles.cache.get(MUTED_ROLE_ID);
        if (!mutedRole) return console.log('Role not found.');

        try {
            await message.member.roles.add(mutedRole);
            await message.channel.send(`${message.author}, you have been muted for 24 hours for using inappropriate language.`);
            setTimeout(async () => {
                await message.member.roles.remove(mutedRole);
                await message.channel.send(`${message.author}, your mute has been lifted.`);
            }, 24 * 60 * 60 * 1000);
        } catch (error) {
            console.error('Error muting user:', error);
        }
    }

    
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    
    if (command === 'ping') {
        message.channel.send('Pong!');
    }
});

client.login(TOKEN);
