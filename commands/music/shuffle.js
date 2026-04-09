const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Shuffle extends Command {
    constructor() {
        super({
            name: 'shuffle',
            description: "Mélanger la file d'attente",
            usage: '!shuffle',
            category: 'music',
            aliases: ['random'],
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

        queue.tracks.shuffle();

        const embed = new Embed(client, guildData)
            .setDescription("La file d'attente a été mélangée.");

        message.reply({ embeds: [embed] });
    }
};
