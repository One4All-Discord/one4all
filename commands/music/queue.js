const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Queue extends Command {
    constructor() {
        super({
            name: 'queue',
            description: "Afficher la file d'attente",
            usage: '!queue',
            category: 'music',
            aliases: ['q'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.reply('Aucune musique en cours.');
        }

        const current = queue.currentTrack;
        const tracks = queue.tracks.toArray().slice(0, 10);

        let desc = `🎵 **En lecture**\n[${current.title}](${current.url}) · \`${current.duration}\`\n\u200b\n`;

        if (tracks.length > 0) {
            desc += tracks.map((t, i) =>
                `\`${i + 1}.\` [${t.title}](${t.url}) · \`${t.duration}\``
            ).join('\n');
            desc += '\n';
        } else {
            desc += '*Rien en file d\'attente*\n';
        }

        if (queue.tracks.size > 10) {
            desc += `\n+**${queue.tracks.size - 10}** autres pistes`;
        }

        const embed = new Embed(client, guildData)
            .setAuthor({ name: "File d'attente", iconURL: client.user.displayAvatarURL() })
            .setDescription(desc);
        message.reply({ embeds: [embed] });
    }
};
