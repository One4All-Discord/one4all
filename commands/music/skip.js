const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Skip extends Command {
    constructor() {
        super({
            name: 'skip',
            description: 'Passer à la musique suivante',
            usage: '!skip',
            category: 'music',
            aliases: ['s'],
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

        const currentTitle = queue.currentTrack.title;
        queue.node.skip();

        const embed = new Embed(client, guildData)
            .setDescription(`**${currentTitle}** a été passée.`);

        message.channel.send({ embeds: [embed] });
    }
};
