const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const StateManager = require('../../utils/StateManager');

const usersPlaylist = new Map();

// Keep in-memory cache in sync via StateManager events
StateManager.on('playlist', (userId, playlists) => {
    usersPlaylist.set(userId, playlists);
});
StateManager.on('playlistDelete', (userId) => {
    usersPlaylist.delete(userId);
});

module.exports = class MyPlaylist extends Command {
    constructor() {
        super({
            name: 'myplaylist',
            description: 'Affiche vos playlists sauvegardees',
            usage: '!myplaylist [playlistName]',
            category: 'music',
            aliases: ['mp'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const color = guildData.color;
        const lang = client.lang(guildData.lang);

        // Load user playlists from DB into cache if not present
        if (!usersPlaylist.has(message.author.id)) {
            const record = await client.database.models.playlist.findOne({ where: { userId: message.author.id } });
            if (record) {
                usersPlaylist.set(message.author.id, record.get('playlist'));
            }
        }

        const authorPlaylist = usersPlaylist.get(message.author.id);

        // No playlist name given: show list of all playlists
        if (!args[0]) {
            const description = !authorPlaylist || authorPlaylist.length === 0
                ? 'Aucune playlist sauvegardee.'
                : authorPlaylist.map((pl, i) => `**${i + 1}.** ${pl.name} (${pl.song.length} musiques)`).join('\n');

            const embed = new Embed(client, guildData)
                .setAuthor({ name: `Playlists de ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setDescription(description)
                .setRequestedBy(message.author);

            return message.reply({ embeds: [embed] });
        }

        // Playlist name given: show songs in that playlist with pagination
        if (!authorPlaylist || authorPlaylist.length === 0) {
            return message.reply('Aucune playlist sauvegardee.');
        }

        const playlistName = args.join(' ');
        const playlist = authorPlaylist.find(pl => pl.name === playlistName);

        if (!playlist) {
            return message.reply(lang.music.playlist.notFound);
        }

        const songs = playlist.song;
        if (!songs || songs.length === 0) {
            return message.reply('Cette playlist est vide.');
        }

        const songsPerPage = 20;
        const totalPages = Math.ceil(songs.length / songsPerPage);
        let currentPage = 0;

        const generateEmbed = (page) => {
            const start = page * songsPerPage;
            const end = Math.min(start + songsPerPage, songs.length);
            const pageSongs = songs.slice(start, end);

            const description = pageSongs
                .map((song, i) => `**${start + i + 1}.** [${song.name}](${song.url}) \`${song.duration}\``)
                .join('\n');

            const embed = new Embed(client, guildData)
                .setAuthor({ name: `Playlist ${playlistName} (${songs.length} musiques)`, iconURL: message.author.displayAvatarURL() })
                .setDescription(description)
                .setRequestedBy(message.author);

            if (totalPages > 1) {
                embed.setFooter({ text: `Page ${page + 1}/${totalPages}` });
            }

            return embed;
        };

        const msg = await message.reply({ embeds: [generateEmbed(currentPage)] });

        // Only add pagination if more than one page
        if (totalPages <= 1) return;

        await msg.react('⬅️');
        await msg.react('➡️');

        const reactionFilter = (reaction, user) => {
            return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        const collector = msg.createReactionCollector({ filter: reactionFilter, time: 120000 });

        collector.on('collect', (reaction) => {
            reaction.users.remove(message.author).catch(() => {});

            if (reaction.emoji.name === '➡️') {
                if (currentPage < totalPages - 1) {
                    currentPage++;
                    msg.edit({ embeds: [generateEmbed(currentPage)] });
                }
            } else if (reaction.emoji.name === '⬅️') {
                if (currentPage > 0) {
                    currentPage--;
                    msg.edit({ embeds: [generateEmbed(currentPage)] });
                }
            }
        });

        collector.on('end', () => {
            msg.reactions.removeAll().catch(() => {});
        });
    }
};
