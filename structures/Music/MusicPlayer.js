const { Player, GuildQueueEvent } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const Embed = require('../Embed');

class MusicPlayer {
    constructor(client) {
        this.client = client;
        this.player = new Player(client);
    }

    async init() {
        await this.player.extractors.loadMulti(DefaultExtractors);
        await this.player.extractors.register(YoutubeiExtractor, {});
        this._registerEvents();
        console.log('[MUSIC] Player initialized with all extractors (+ YouTube)');
    }

    _registerEvents() {
        const { player, client } = this;

        player.events.on(GuildQueueEvent.PlayerStart, (queue, track) => {
            const guildData = client.getGuildData(queue.guild.id);

            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'En lecture', iconURL: client.user.displayAvatarURL() })
                .setThumbnail(track.thumbnail)
                .setDescription(
                    `**[${track.title}](${track.url})**\n\u200b`
                )
                .addFields(
                    { name: 'Durée', value: `\`${track.duration}\``, inline: true },
                    { name: 'Source', value: `\`${track.source || 'Inconnu'}\``, inline: true },
                    { name: 'En file', value: `\`${queue.tracks.size}\``, inline: true },
                );

            if (track.requestedBy) {
                embed.setFooter({ text: track.requestedBy.username, iconURL: track.requestedBy.displayAvatarURL() });
            }

            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.AudioTrackAdd, (queue, track) => {
            if (!queue.isPlaying()) return;
            const guildData = client.getGuildData(queue.guild.id);

            const embed = new Embed(client, guildData)
                .setDescription(`**[${track.title}](${track.url})** ajoutée · \`${track.duration}\``);

            if (track.requestedBy) {
                embed.setFooter({ text: track.requestedBy.username, iconURL: track.requestedBy.displayAvatarURL() });
            }

            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.AudioTracksAdd, (queue, tracks) => {
            const guildData = client.getGuildData(queue.guild.id);
            const embed = new Embed(client, guildData)
                .setDescription(`**${tracks.length}** pistes ajoutées à la file`);
            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.PlayerSkip, (queue, track) => {
            const guildData = client.getGuildData(queue.guild.id);
            const embed = new Embed(client, guildData)
                .setWarning()
                .setDescription(`Impossible de lire **${track.title}**, passage à la suite`);
            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.EmptyQueue, (queue) => {
            const guildData = client.getGuildData(queue.guild.id);
            const embed = new Embed(client, guildData)
                .setDescription(`File d'attente terminée`);
            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.EmptyChannel, (queue) => {
            const guildData = client.getGuildData(queue.guild.id);
            const embed = new Embed(client, guildData)
                .setDescription(`Salon vide — déconnexion`);
            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.Disconnect, (queue) => {
            const guildData = client.getGuildData(queue.guild.id);
            const embed = new Embed(client, guildData)
                .setDescription(`Déconnecté du salon vocal`);
            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.Error, (queue, error) => {
            console.error('[MUSIC ERROR]', error);
            const guildData = client.getGuildData(queue.guild.id);
            const embed = new Embed(client, guildData).setError()
                .setDescription(`Erreur — \`${error.message}\``);
            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });

        player.events.on(GuildQueueEvent.PlayerError, (queue, error) => {
            console.error('[MUSIC PLAYER ERROR]', error);
            const guildData = client.getGuildData(queue.guild.id);
            const embed = new Embed(client, guildData).setError()
                .setDescription(`Erreur de lecture — \`${error.message}\``);
            queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
        });
    }
}

function _loopName(mode) {
    const names = { 0: 'Off', 1: 'Track', 2: 'Queue', 3: 'Autoplay' };
    return names[mode] || 'Off';
}

module.exports = MusicPlayer;
