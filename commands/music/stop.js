const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Stop extends Command {
    constructor() {
        super({
            name: 'stop',
            description: 'Arrêter la musique',
            usage: '!stop',
            category: 'music',
            aliases: ['disconnect', 'deco'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.reply('Aucune musique en cours.');
        }

        queue.delete();

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'Musique arrêtée', iconURL: client.user.displayAvatarURL() })
            .setDescription('La file a été vidée et le bot déconnecté.');
        message.reply({ embeds: [embed] });
    }
};
