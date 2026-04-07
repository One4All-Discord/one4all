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
        const lang = client.lang(guildData.lang);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.channel.send('Aucune musique en cours de lecture.');
        }

        const current = queue.currentTrack;
        const tracks = queue.tracks.toArray().slice(0, 15);

        let description = `**En lecture:**\n[${current.title}](${current.url}) - \`${current.duration}\`\n\n`;

        if (tracks.length > 0) {
            description += `**File d'attente:**\n`;
            description += tracks.map((track, i) =>
                `**${i + 1}.** [${track.title}](${track.url}) - \`${track.duration}\``
            ).join('\n');
        } else {
            description += "La file d'attente est vide.";
        }

        const totalTracks = queue.tracks.size;
        if (totalTracks > 15) {
            description += `\n\n... et **${totalTracks - 15}** autre(s) musique(s).`;
        }

        const embed = new Embed(client, guildData)
            .setAuthor({ name: "File d'attente" })
            .setDescription(description);

        message.channel.send({ embeds: [embed] });
    }
};
