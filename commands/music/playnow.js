const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class PlayNow extends Command {
    constructor() {
        super({
            name: 'playnow',
            description: 'Jouer une musique immédiatement en sautant la file',
            usage: '!playnow <url/titre>',
            category: 'music',
            aliases: ['pn', 'pnow'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const query = args.join(' ');

        if (!message.member.voice.channel) {
            return message.reply('Vous devez être dans un salon vocal pour jouer de la musique.');
        }
        if (!query) {
            return message.reply('Veuillez spécifier une musique à jouer.');
        }

        try {
            const queue = useQueue(message.guildId);
            const hadTracks = queue && queue.currentTrack;

            const { track } = await client.music.play(message.member.voice.channel, query, {
                nodeOptions: {
                    metadata: { channel: message.channel },
                },
                requestedBy: message.author,
            });

            if (hadTracks && queue) {
                const trackIndex = queue.tracks.toArray().findIndex(t => t.url === track.url);
                if (trackIndex > 0) {
                    queue.moveTrack(trackIndex, 0);
                }
                queue.node.skip();
            }

            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Lecture immédiate' })
                .setDescription(`[**${track.title}**](${track.url}) est maintenant en lecture.`)
                .setThumbnail(track.thumbnail)
                .setRequestedBy(message.author);

            message.reply({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            message.reply('Une erreur est survenue lors de la lecture.');
        }
    }
};
