const { PermissionFlagsBits } = require('discord.js');
const { QueryType } = require('discord-player');
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

module.exports = class Playlist extends Command {
    constructor() {
        super({
            name: 'playlist',
            description: 'Manage your playlist | Gerer vos playlist',
            usage: '!playlist <add/delete/remove/import/create> <playlistName>',
            category: 'music',
            aliases: ['pl'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const color = guildData.color;
        const lang = client.lang(guildData.lang);
        const type = args[0];
        const playlistName = args.slice(1).join(' ');

        if (!playlistName) return message.reply(lang.music.playlist.noPlaylistName);

        const filter = response => response.author.id === message.author.id;

        // Load user playlists from DB into cache if not present
        if (!usersPlaylist.has(message.author.id)) {
            const record = await client.database.models.playlist.findOne({ where: { userId: message.author.id } });
            if (record) {
                usersPlaylist.set(message.author.id, record.get('playlist'));
            }
        }

        if (type === 'create') {
            await this.handleCreate(client, message, playlistName, filter, lang, color);
        } else if (type === 'add') {
            await this.handleAdd(client, message, playlistName, filter, lang, color);
        } else if (type === 'remove') {
            await this.handleRemove(client, message, playlistName, filter, lang);
        } else if (type === 'delete') {
            await this.handleDelete(client, message, playlistName, lang);
        } else if (type === 'import') {
            await this.handleImport(client, message, playlistName, filter, lang, color);
        }
    }

    /**
     * Search a single track using discord-player v7
     */
    async searchTrack(client, query, requestedBy) {
        const result = await client.music.search(query, { requestedBy });
        if (!result || !result.tracks || result.tracks.length === 0) return null;
        const track = result.tracks[0];
        return {
            name: track.title,
            url: track.url,
            thumbnail: track.thumbnail,
            duration: track.duration,
        };
    }

    /**
     * CREATE - create a new playlist with a first song
     */
    async handleCreate(client, message, playlistName, filter, lang, color) {
        if (usersPlaylist.has(message.author.id)) {
            const authorPlaylist = usersPlaylist.get(message.author.id);
            if (authorPlaylist.length >= 10) {
                return message.reply(lang.music.playlist.toManyPlaylist);
            }
            if (authorPlaylist.find(pl => pl.name === playlistName)) {
                return message.reply(lang.music.playlist.alreadyName);
            }
        }

        const mp = await message.reply(lang.music.playlist.createQ);
        try {
            const collected = await mp.channel.awaitMessages({ filter, max: 1, time: 30000 });
            const msg = collected.first();
            if (!msg) return;

            const url = msg.content;
            if (!url) return message.reply(lang.music.playlist.provideOnlyValidUrl);

            const awaiting = await message.reply(lang.loading);
            const trackInfo = await this.searchTrack(client, url, message.author);
            if (!trackInfo) {
                return awaiting.edit(lang.music.playlist.provideOnlyValidUrl);
            }

            const newPlaylist = { name: playlistName, song: [trackInfo] };

            if (usersPlaylist.has(message.author.id)) {
                const authorPlaylist = usersPlaylist.get(message.author.id);
                authorPlaylist.push(newPlaylist);
                await client.database.models.playlist.update(
                    { playlist: authorPlaylist },
                    { where: { userId: message.author.id } }
                );
                StateManager.emit('playlist', message.author.id, authorPlaylist);
            } else {
                const playlists = [newPlaylist];
                await client.database.models.playlist.create({
                    userId: message.author.id,
                    playlist: playlists,
                });
                StateManager.emit('playlist', message.author.id, playlists);
            }

            awaiting.edit(lang.music.playlist.successCreate(playlistName)).then(m => {
                setTimeout(() => {
                    m.delete().catch(() => {});
                    msg.delete().catch(() => {});
                    mp.delete().catch(() => {});
                }, 5000);
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * ADD - add a song to an existing playlist
     */
    async handleAdd(client, message, playlistName, filter, lang, color) {
        if (!usersPlaylist.has(message.author.id)) return message.reply(lang.music.playlist.noPlaylist);

        const authorPlaylist = usersPlaylist.get(message.author.id);
        const playlistToEdit = authorPlaylist.find(pl => pl.name === playlistName);
        if (!playlistToEdit) return message.reply(lang.music.playlist.notFound);

        const mp = await message.reply(lang.music.playlist.urlQ(playlistName));
        try {
            const collected = await mp.channel.awaitMessages({ filter, max: 1, time: 30000 });
            const msg = collected.first();
            if (!msg) return;

            const url = msg.content;
            if (!url) return message.reply(lang.music.playlist.provideOnlyValidUrl);

            const awaiting = await message.reply(lang.loading);
            const trackInfo = await this.searchTrack(client, url, message.author);
            if (!trackInfo) {
                return awaiting.edit(lang.music.playlist.provideOnlyValidUrl);
            }

            const index = authorPlaylist.indexOf(playlistToEdit);
            playlistToEdit.song.push(trackInfo);
            authorPlaylist[index] = playlistToEdit;

            await client.database.models.playlist.update(
                { playlist: authorPlaylist },
                { where: { userId: message.author.id } }
            );
            StateManager.emit('playlist', message.author.id, authorPlaylist);

            awaiting.edit(lang.music.playlist.successAdd(playlistName)).then(m => {
                setTimeout(() => {
                    m.delete().catch(() => {});
                    msg.delete().catch(() => {});
                    mp.delete().catch(() => {});
                }, 2000);
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * REMOVE - remove a song from a playlist by URL
     */
    async handleRemove(client, message, playlistName, filter, lang) {
        if (!usersPlaylist.has(message.author.id)) return message.reply(lang.music.playlist.noPlaylist);

        const authorPlaylist = usersPlaylist.get(message.author.id);
        const playlistToEdit = authorPlaylist.find(pl => pl.name === playlistName);
        if (!playlistToEdit) return message.reply(lang.music.playlist.notFound);

        const mp = await message.reply(lang.music.playlist.removeQ);
        try {
            const collected = await mp.channel.awaitMessages({ filter, max: 1, time: 30000 });
            const msg = collected.first();
            if (!msg) return;

            if (msg.content.toLowerCase() === 'cancel') {
                return message.reply(lang.cancel).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {});
                        mp.delete().catch(() => {});
                        msg.delete().catch(() => {});
                    }, 5000);
                });
            }

            const url = msg.content;
            const songs = playlistToEdit.song;

            if (!songs.find(s => s.url === url)) {
                return message.reply(lang.music.playlist.songNotFound);
            }

            playlistToEdit.song = songs.filter(s => s.url !== url);
            const index = authorPlaylist.indexOf(playlistToEdit);
            authorPlaylist[index] = playlistToEdit;

            await client.database.models.playlist.update(
                { playlist: authorPlaylist },
                { where: { userId: message.author.id } }
            );
            StateManager.emit('playlist', message.author.id, authorPlaylist);

            message.reply(lang.music.playlist.successRemove(playlistName)).then(m => {
                setTimeout(() => {
                    m.delete().catch(() => {});
                    mp.delete().catch(() => {});
                }, 5000);
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * DELETE - delete an entire playlist
     */
    async handleDelete(client, message, playlistName, lang) {
        if (!usersPlaylist.has(message.author.id)) return message.reply(lang.music.playlist.noPlaylist);

        const authorPlaylist = usersPlaylist.get(message.author.id);
        const playlistToEdit = authorPlaylist.find(pl => pl.name === playlistName);
        if (!playlistToEdit) return message.reply(lang.music.playlist.notFound);

        const newAuthorPlaylist = authorPlaylist.filter(pl => pl.name !== playlistName);

        if (newAuthorPlaylist.length === 0) {
            await client.database.models.playlist.destroy({ where: { userId: message.author.id } });
            StateManager.emit('playlistDelete', message.author.id);
        } else {
            await client.database.models.playlist.update(
                { playlist: newAuthorPlaylist },
                { where: { userId: message.author.id } }
            );
            StateManager.emit('playlist', message.author.id, newAuthorPlaylist);
        }

        message.reply(lang.music.playlist.successDelete(playlistName)).then(m => {
            setTimeout(() => {
                m.delete().catch(() => {});
            }, 5000);
        });
    }

    /**
     * IMPORT - import a YouTube playlist URL (max 50 songs)
     */
    async handleImport(client, message, playlistName, filter, lang, color) {
        if (usersPlaylist.has(message.author.id)) {
            const authorPlaylist = usersPlaylist.get(message.author.id);
            if (authorPlaylist.length >= 10) {
                return message.reply(lang.music.playlist.toManyPlaylist);
            }
            if (authorPlaylist.find(pl => pl.name === playlistName)) {
                return message.reply(lang.music.playlist.alreadyName);
            }
        }

        const mp = await message.reply(lang.music.playlist.urlPlaylistQ);
        try {
            const collected = await mp.channel.awaitMessages({ filter, max: 1, time: 30000 });
            const msg = collected.first();
            if (!msg) return;

            const url = msg.content;
            if (!url) return message.reply(lang.music.playlist.provideOnlyValidUrl);

            const awaiting = await message.reply(lang.loading);

            // Use discord-player v7 search with YOUTUBE_PLAYLIST type
            const result = await client.music.search(url, {
                requestedBy: message.author,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            if (!result || !result.tracks || result.tracks.length === 0) {
                return awaiting.edit(lang.music.playlist.provideOnlyValidUrl);
            }

            let tracks = result.tracks;
            if (tracks.length > 50) {
                awaiting.edit(lang.music.playlist.playlistToLong);
                tracks = tracks.slice(0, 50);
            }

            const newPlaylist = {
                name: playlistName,
                song: tracks.map(track => ({
                    name: track.title,
                    url: track.url,
                    thumbnail: track.thumbnail,
                    duration: track.duration,
                })),
            };

            if (usersPlaylist.has(message.author.id)) {
                const authorPlaylist = usersPlaylist.get(message.author.id);
                authorPlaylist.push(newPlaylist);
                await client.database.models.playlist.update(
                    { playlist: authorPlaylist },
                    { where: { userId: message.author.id } }
                );
                StateManager.emit('playlist', message.author.id, authorPlaylist);
            } else {
                const playlists = [newPlaylist];
                await client.database.models.playlist.create({
                    userId: message.author.id,
                    playlist: playlists,
                });
                StateManager.emit('playlist', message.author.id, playlists);
            }

            awaiting.edit(lang.music.playlist.successImport(playlistName)).then(m => {
                setTimeout(() => {
                    m.delete().catch(() => {});
                    msg.delete().catch(() => {});
                    mp.delete().catch(() => {});
                }, 10000);
            });
        } catch (e) {
            console.error(e);
        }
    }
};
