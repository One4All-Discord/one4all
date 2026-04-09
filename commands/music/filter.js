const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

const AVAILABLE_FILTERS = [
    '3d', 'bassboost', 'echo', 'karaoke', 'nightcore',
    'vaporwave', 'flanger', 'gate', 'haas', 'reverse',
    'surround', 'mcompand', 'phaser', 'tremolo', 'earwax'
];

module.exports = class Filter extends Command {
    constructor() {
        super({
            name: 'filter',
            description: 'Appliquer un filtre audio',
            usage: '!filter <filtre/off>',
            category: 'music',
            tags: ['guildOnly', 'voiceOnly'],
            aliases: ['fl', 'filtre', 'effet'],
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

        const filter = args[0]?.toLowerCase();
        if (!filter || (filter !== 'off' && !AVAILABLE_FILTERS.includes(filter))) {
            return message.reply(
                `Filtres disponibles: \`${AVAILABLE_FILTERS.join('`, `')}\`, \`off\``
            );
        }

        if (filter === 'off') {
            queue.filters.ffmpeg.setInputArgs([]);
            const embed = new Embed(client, guildData)
                .setDescription('Tous les filtres ont été désactivés.');
            return message.reply({ embeds: [embed] });
        }

        await queue.filters.ffmpeg.toggle([filter]);
        const activeFilters = queue.filters.ffmpeg.getFiltersEnabled();
        const activeList = activeFilters.length > 0 ? activeFilters.join(', ') : 'Aucun';

        const embed = new Embed(client, guildData)
            .setDescription(`Filtre **${filter}** basculé.\nFiltres actifs: **${activeList}**`);

        message.reply({ embeds: [embed] });
    }
};
