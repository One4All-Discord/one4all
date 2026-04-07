const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Resume extends Command {
    constructor() {
        super({
            name: 'resume',
            description: 'Reprendre la musique',
            usage: '!resume',
            category: 'music',
            aliases: ['unpause'],
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

        queue.node.setPaused(false);

        const embed = new Embed(client, guildData)
            .setDescription('La musique a été reprise.');

        message.channel.send({ embeds: [embed] });
    }
};
