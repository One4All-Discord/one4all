const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Pause extends Command {
    constructor() {
        super({
            name: 'pause',
            description: 'Mettre en pause ou reprendre la musique',
            usage: '!pause',
            category: 'music',
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.channel.send('Aucune musique en cours de lecture.');
        }

        queue.node.setPaused(!queue.node.isPaused);

        const status = queue.node.isPaused ? 'mise en pause' : 'reprise';
        const embed = new Embed(client, guildData)
            .setDescription(`La musique a été **${status}**.`);

        message.channel.send({ embeds: [embed] });
    }
};
