const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Previous extends Command {
    constructor() {
        super({
            name: 'previous',
            description: 'Jouer la musique précédente',
            usage: '!previous',
            category: 'music',
            aliases: ['prev'],
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

        try {
            await queue.history.previous();
            const embed = new Embed(client, guildData)
                .setDescription('Retour à la musique précédente.');
            message.channel.send({ embeds: [embed] });
        } catch (e) {
            message.channel.send('Aucune musique précédente disponible.');
        }
    }
};
