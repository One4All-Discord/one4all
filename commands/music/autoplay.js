const { PermissionFlagsBits } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Autoplay extends Command {
    constructor() {
        super({
            name: 'autoplay',
            description: "Activer ou désactiver l'autoplay",
            usage: '!autoplay',
            category: 'music',
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

        const isAutoplay = queue.repeatMode === QueueRepeatMode.AUTOPLAY;
        queue.setRepeatMode(isAutoplay ? QueueRepeatMode.OFF : QueueRepeatMode.AUTOPLAY);

        const status = isAutoplay ? 'désactivé' : 'activé';
        const embed = new Embed(client, guildData)
            .setDescription(`L'autoplay a été **${status}**.`);

        message.reply({ embeds: [embed] });
    }
};
