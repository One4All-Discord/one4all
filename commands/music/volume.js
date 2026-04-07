const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Volume extends Command {
    constructor() {
        super({
            name: 'volume',
            description: 'Changer le volume de la musique',
            usage: '!volume <0-100>',
            category: 'music',
            aliases: ['v', 'up'],
            tags: ['guildOnly', 'voiceOnly'],
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

        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) {
            return message.channel.send('Veuillez spécifier un nombre entre 0 et 100.');
        }

        queue.node.setVolume(volume);

        const embed = new Embed(client, guildData)
            .setDescription(`Le volume a été réglé à **${volume}%**.`);

        message.channel.send({ embeds: [embed] });
    }
};
