const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Stop extends Command {
    constructor() {
        super({
            name: 'stop',
            description: 'Arrêter la musique et déconnecter le bot',
            usage: '!stop',
            category: 'music',
            aliases: ['disconnect', 'deco'],
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

        queue.delete();

        const embed = new Embed(client, guildData)
            .setDescription('La musique a été arrêtée et la file vidée.');

        message.channel.send({ embeds: [embed] });
    }
};
