const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Pause extends Command {
    constructor() {
        super({
            name: 'pause',
            description: 'Mettre en pause la musique',
            usage: '!pause',
            category: 'music',
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.reply('Aucune musique en cours.');
        }

        queue.node.setPaused(!queue.node.isPaused);
        const paused = queue.node.isPaused;

        const embed = new Embed(client, guildData)
            .setAuthor({ name: paused ? 'Musique en pause' : 'Musique reprise', iconURL: client.user.displayAvatarURL() });
        message.reply({ embeds: [embed] });
    }
};
