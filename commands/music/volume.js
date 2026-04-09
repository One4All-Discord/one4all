const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Volume extends Command {
    constructor() {
        super({
            name: 'volume',
            description: 'Changer le volume',
            usage: '!volume <0-100>',
            category: 'music',
            aliases: ['v', 'up'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.reply('Aucune musique en cours.');
        }

        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) {
            return message.reply('Nombre entre 0 et 100.');
        }

        queue.node.setVolume(volume);

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'Volume', iconURL: client.user.displayAvatarURL() })
            .setDescription(`Volume réglé à **${volume}%**`);
        message.reply({ embeds: [embed] });
    }
};
