const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Resume extends Command {
    constructor() {
        super({
            name: 'resume',
            description: 'Reprendre la musique',
            usage: '!resume',
            category: 'music',
            aliases: ['unpause'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.reply('Aucune musique en cours.');
        }

        queue.node.setPaused(false);

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'Musique reprise', iconURL: client.user.displayAvatarURL() });
        message.reply({ embeds: [embed] });
    }
};
