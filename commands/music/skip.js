const { PermissionFlagsBits } = require('discord.js');
const { useQueue } = require('discord-player');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Skip extends Command {
    constructor() {
        super({
            name: 'skip',
            description: 'Passer à la musique suivante',
            usage: '!skip',
            category: 'music',
            aliases: ['s'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const queue = useQueue(message.guildId);

        if (!queue || !queue.currentTrack) {
            return message.reply('Aucune musique en cours.');
        }

        const title = queue.currentTrack.title;
        queue.node.skip();

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'Piste passée', iconURL: client.user.displayAvatarURL() })
            .setDescription(`**${title}**`);
        message.reply({ embeds: [embed] });
    }
};
