const { PermissionFlagsBits } = require('discord.js');
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
        const query = args.join(' ');

        if (!message.member.voice.channel) {
            return message.reply('Vous devez être dans un salon vocal.');
        }
        if (!query) {
            return message.reply('Spécifiez une musique.');
        }

        try {
            const { track } = await client.music.play(message.member.voice.channel, query, {
                nodeOptions: {
                    metadata: { channel: message.channel },
                    leaveOnEmpty: false,
                    leaveOnEnd: false,
                    leaveOnStop: false,
                },
                requestedBy: message.author,
            });

            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Ajoutée à la file', iconURL: client.user.displayAvatarURL() })
                .setThumbnail(track.thumbnail)
                .setDescription(
                    `**[${track.title}](${track.url})**\n\u200b`
                )
                .addFields(
                    { name: 'Durée', value: `\`${track.duration}\``, inline: true },
                    { name: 'Source', value: `\`${track.source || 'Inconnu'}\``, inline: true },
                )
                .setRequestedBy(message.author);
            message.reply({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            const embed = new Embed(client, guildData).setError()
                .setDescription('Impossible de lire cette piste.');
            message.reply({ embeds: [embed] });
        }
    }
};
