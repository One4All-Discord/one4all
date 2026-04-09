const { PermissionFlagsBits } = require('discord.js');
const { QueryType } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Search extends Command {
    constructor() {
        super({
            name: 'search',
            description: 'Chercher une musique',
            usage: '!search <titre>',
            category: 'music',
            aliases: ['find', 'chercher'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const query = args.join(' ');

        if (!query) {
            return message.reply('Veuillez spécifier une recherche.');
        }
        if (!message.member.voice.channel) {
            return message.reply('Vous devez être dans un salon vocal.');
        }

        const msg = await message.reply('Recherche en cours...');

        try {
            const result = await client.music.search(query, {
                requestedBy: message.author,
            });

            if (!result.hasTracks()) {
                return msg.edit('Aucun résultat trouvé.');
            }

            const tracks = result.tracks.slice(0, 10);
            const emojis = ['1\u20E3', '2\u20E3', '3\u20E3', '4\u20E3', '5\u20E3', '6\u20E3', '7\u20E3', '8\u20E3', '9\u20E3', '\uD83D\uDD1F'];

            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Résultats de recherche' })
                .setDescription(
                    tracks.map((track, i) =>
                        `**${i + 1}.** ${track.title} - \`${track.duration}\``
                    ).join('\n')
                )
                .setFooter({ text: 'Réagissez pour choisir une musique (2 min)' });

            await msg.edit({ content: null, embeds: [embed] });

            for (let i = 0; i < tracks.length; i++) {
                await msg.react(emojis[i]);
            }

            const filter = (reaction, user) =>
                emojis.includes(reaction.emoji.name) && user.id === message.author.id;

            const collector = msg.createReactionCollector({ filter, time: 120000, max: 1 });

            collector.on('collect', async (reaction) => {
                const index = emojis.indexOf(reaction.emoji.name);
                if (index < 0 || index >= tracks.length) return;

                const chosen = tracks[index];
                try {
                    await client.music.play(message.member.voice.channel, chosen.url, {
                        nodeOptions: {
                            metadata: { channel: message.channel },
                        },
                        requestedBy: message.author,
                    });

                    const playEmbed = new Embed(client, guildData)
                        .setDescription(`[**${chosen.title}**](${chosen.url}) ajoutée à la file d'attente.`);
                    message.reply({ embeds: [playEmbed] });
                } catch (e) {
                    console.error(e);
                    message.reply('Erreur lors de la lecture.');
                }
            });

            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    message.reply('Recherche expirée.');
                }
                msg.reactions.removeAll().catch(() => {});
            });
        } catch (e) {
            console.error(e);
            msg.edit('Aucun résultat trouvé.');
        }
    }
};
