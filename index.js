const moment = require('moment');
require('dotenv').config();
const Client = require('./structures/Client/OneForAll');
const { GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    rest: { offset: 0 },
    allowedMentions: { repliedUser: false },
});

require('events').EventEmitter.defaultMaxListeners = 0;
moment.locale('fr');


const config = require('./config');
const DEV_LOG_CHANNEL = config.devLogChannel;

async function sendDevLog(title, error) {
    try {
        const channel = await client.channels.fetch(DEV_LOG_CHANNEL).catch(() => null);
        if (!channel) return;
        const stack = error?.stack || String(error);
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(title)
            .setDescription(`\`\`\`js\n${stack.slice(0, 4000)}\n\`\`\``)
            .setTimestamp();
        await channel.send({ embeds: [embed] });
    } catch (_) {}
}

process.on('unhandledRejection', (error) => {
    console.error('[UNHANDLED REJECTION]', error.message || error);
    if (error.stack) console.error(error.stack);
    sendDevLog('⚠️ Unhandled Rejection', error);
});

process.on('uncaughtException', (error) => {
    console.error('[UNCAUGHT EXCEPTION]', error.message || error);
    if (error.stack) console.error(error.stack);
    sendDevLog('🔴 Uncaught Exception', error);
});

client.on('error', (error) => {
    console.error('[CLIENT ERROR]', error.message || error);
    sendDevLog('🟠 Client Error', error);
});

client.on('warn', (message) => {
    console.warn('[CLIENT WARN]', message);
    sendDevLog('🟡 Client Warning', { stack: message });
});
