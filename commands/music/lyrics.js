const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const lyricsFinder = require('lyrics-finder');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Lyrics extends Command {
    constructor() {
        super({
            name: 'lyrics',
            description: 'Afficher les paroles de la musique en cours',
            usage: '!lyrics',
            category: 'music',
            aliases: ['ly'],
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

        const track = queue.currentTrack;
        let lyrics = null;

        try {
            lyrics = await lyricsFinder(track.title, '');
            if (!lyrics) lyrics = `Paroles introuvables pour **${track.title}**.`;
        } catch (e) {
            console.error(e);
            lyrics = `Paroles introuvables pour **${track.title}**.`;
        }

        const embed = new Embed(client, guildData)
            .setAuthor({ name: `Paroles - ${track.title}` })
            .setDescription(lyrics.length > 2048 ? lyrics.substring(0, 2045) + '...' : lyrics);

        message.reply({ embeds: [embed] });
    }
};
