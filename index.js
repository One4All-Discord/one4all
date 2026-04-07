const moment = require('moment');
require('dotenv').config();
const Client = require('./structures/Client/OneForAll');
const { GatewayIntentBits, Partials } = require('discord.js');

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
});

require('events').EventEmitter.defaultMaxListeners = 0;
moment.locale('fr');


process.on('unhandledRejection', (error) => {
    console.error('[UNHANDLED REJECTION]', error.message || error);
    if (error.stack) console.error(error.stack);
});

client.on('error', (error) => {
    console.error('[CLIENT ERROR]', error.message || error);
});
