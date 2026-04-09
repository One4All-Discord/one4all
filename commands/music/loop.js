const { PermissionFlagsBits } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Loop extends Command {
    constructor() {
        super({
            name: 'loop',
            description: 'Changer le mode de répétition',
            usage: '!loop <off/track/queue/autoplay>',
            category: 'music',
            aliases: ['rp'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.reply('Aucune musique en cours de lecture.');
        }

        const modes = {
            'off': QueueRepeatMode.OFF,
            'track': QueueRepeatMode.TRACK,
            'song': QueueRepeatMode.TRACK,
            'queue': QueueRepeatMode.QUEUE,
            'autoplay': QueueRepeatMode.AUTOPLAY,
        };

        const modeNames = {
            [QueueRepeatMode.OFF]: 'Désactivé',
            [QueueRepeatMode.TRACK]: 'Répéter la musique',
            [QueueRepeatMode.QUEUE]: 'Répéter la file',
            [QueueRepeatMode.AUTOPLAY]: 'Autoplay',
        };

        const input = args[0]?.toLowerCase();
        if (!input || !(input in modes)) {
            return message.reply('Modes disponibles: `off`, `track`, `queue`, `autoplay`.');
        }

        const mode = modes[input];
        queue.setRepeatMode(mode);

        const embed = new Embed(client, guildData)
            .setDescription(`Mode de répétition: **${modeNames[mode]}**.`);

        message.reply({ embeds: [embed] });
    }
};
