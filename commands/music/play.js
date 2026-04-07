const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Play extends Command {
    constructor() {
        super({
            name: 'play',
            description: 'Jouer une musique',
            usage: '!play <url/titre>',
            category: 'music',
            aliases: ['p'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const query = args.join(' ');

        if (!message.member.voice.channel) {
            return message.channel.send('Vous devez être dans un salon vocal pour jouer de la musique.');
        }
        if (!query) {
            return message.channel.send('Veuillez spécifier une musique à jouer.');
        }

        try {
            const { track } = await client.music.play(message.member.voice.channel, query, {
                nodeOptions: {
                    metadata: { channel: message.channel },
                },
                requestedBy: message.author,
            });

            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Musique ajoutée' })
                .setDescription(`[**${track.title}**](${track.url}) a été ajoutée à la file d'attente.`)
                .setThumbnail(track.thumbnail)
                .setRequestedBy(message.author);

            message.channel.send({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            message.channel.send('Une erreur est survenue lors de la lecture.');
        }
    }
};
