const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class Support extends Command {
    constructor() {
        super({
            name: 'support',
            description: 'Get the support server | Avoir le serveur de support',
            usage: 'support',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            category: 'everyone',
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'Serveur Support', iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
            .setDescription(
                `Rejoins le serveur officiel pour obtenir de l'aide,\nsignaler un bug ou suivre les mises à jour.\n\u200b\n` +
                `**[Rejoindre le support](https://discord.gg/TfwGcCjyfp)**`
            );
        message.reply({ embeds: [embed] });
    }
};
