const { Player, GuildQueueEvent } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const Embed = require('../Embed');

class MusicPlayer {
    constructor(client) {
        this.client = client;
        this.player = new Player(client);
    }

    async init() {
        await this.player.extractors.loadMulti(DefaultExtractors);
        this._registerEvents();
        console.log('[MUSIC] Player initialized with all extractors');
    }

    _registerEvents() {
        const { player, client } = this;

        player.events.on(GuildQueueEvent.PlayerStart, (queue, track) => {
            const guildData = client.getGuildData(queue.guild.id);
            const lang = client.lang(guildData.lang);

            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'En lecture', iconURL: client.user.displayAvatarURL() })
                .setDescription([
                    `> **[${track.title}](${track.url})**`,
                    `> Duree: \`${track.duration}\` | Source: \`${track.source || 'Inconnu'}\``,
                ].join('\n'))
                .setThumbnail(track.thumbnail)
                .addFields(
                    {
                        name: 'File d\'attente',
                        value: `> Volume: \`${queue.node.volume}%\` | Tracks: \`${queue.tracks.size}\` | Loop: \`${_loopName(queue.repeatMode)}\``,
                    }
                );

            if (track.requestedBy) {
                embed.setFooter({ text: `Demande par ${track.requestedBy.username}`, iconURL: track.requestedBy.displayAvatarURL() });
            }

            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.AudioTrackAdd, (queue, track) => {
            if (!queue.isPlaying()) return;
            const guildData = client.getGuildData(queue.guild.id);

            const embed = new Embed(client, guildData)
                .setDescription(`> Ajoute a la file: **[${track.title}](${track.url})** — \`${track.duration}\``)

            if (track.requestedBy) {
                embed.setFooter({ text: track.requestedBy.username, iconURL: track.requestedBy.displayAvatarURL() });
            }

            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.AudioTracksAdd, (queue, tracks) => {
            const guildData = client.getGuildData(queue.guild.id);

            const embed = new Embed(client, guildData)
                .setDescription(`> **${tracks.length}** tracks ajoutees a la file d'attente`);

            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.PlayerSkip, (queue, track) => {
            queue.metadata.channel.send({ content: `> Track \`${track.title}\` impossible a lire, passage a la suivante...` }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.EmptyQueue, (queue) => {
            const guildData = client.getGuildData(queue.guild.id);
            const embed = new Embed(client, guildData)
                .setDescription('> La file d\'attente est terminee.');
            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.EmptyChannel, (queue) => {
            queue.metadata.channel.send({ content: '> Plus personne dans le salon vocal, deconnexion.' }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.Disconnect, (queue) => {
            queue.metadata.channel.send({ content: '> Deconnecte du salon vocal.' }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.Error, (queue, error) => {
            console.error('[MUSIC ERROR]', error);
            queue.metadata.channel.send({ content: `> Une erreur est survenue: \`${error.message}\`` }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.PlayerError, (queue, error) => {
            console.error('[MUSIC PLAYER ERROR]', error);
            queue.metadata.channel.send({ content: `> Erreur de lecture: \`${error.message}\`` }).catch(() => {});
        });
    }
}

function _loopName(mode) {
    const names = { 0: 'Off', 1: 'Track', 2: 'Queue', 3: 'Autoplay' };
    return names[mode] || 'Off';
}

module.exports = MusicPlayer;
