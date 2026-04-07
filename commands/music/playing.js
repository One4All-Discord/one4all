const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class NowPlaying extends Command {
    constructor() {
        super({
            name: 'nowplaying',
            description: 'Afficher la musique en cours',
            usage: '!nowplaying',
            category: 'music',
            aliases: ['np', 'current-song', 'now-playing'],
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

        const track = queue.currentTrack;
        const progressBar = queue.node.createProgressBar();
        const timestamp = queue.node.getTimestamp();

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'En lecture' })
            .setDescription(
                `**[${track.title}](${track.url})**\n` +
                `Auteur: **${track.author}**\n` +
                `Durée: **${track.duration}**\n` +
                `Demandé par: **${track.requestedBy}**\n\n` +
                `${progressBar}\n` +
                `\`${timestamp?.current?.label || '0:00'} / ${timestamp?.total?.label || track.duration}\``
            )
            .setThumbnail(track.thumbnail)
            .setRequestedBy(track.requestedBy);

        if (track.raw?.live) {
            embed.addFields({ name: '\u200b', value: 'LIVE' });
        }

        message.channel.send({ embeds: [embed] });
    }
};
