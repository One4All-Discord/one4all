const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class AuthorInfo extends Command {
    constructor() {
        super({
            name: 'authorinfo',
            description: 'Information sur le développeur',
            category: 'info',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            aliases: ['author', 'createur'],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'Développeur', iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
            .setDescription(
                `**One4All** est développé par **KhdDev**\n\u200b\n` +
                `**[Discord](https://discord.gg/TfwGcCjyfp)** · **[GitHub](https://github.com/KhdDev)**`
            );
        message.reply({ embeds: [embed] });
    }
};
