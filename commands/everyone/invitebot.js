const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class InviteBot extends Command {
    constructor() {
        super({
            name: 'invitebot',
            description: "Get the bot invitation | Afficher l'invitation du bot",
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            aliases: ['addbot'],
            usage: 'invitebot',
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'Inviter le bot', iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
            .setDescription(
                `Ajoute **${client.user.username}** sur ton serveur !\n\u200b\n` +
                `**[Ajouter à mon serveur](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)**\n` +
                `**[Serveur support](https://discord.gg/TfwGcCjyfp)**`
            );
        message.reply({ embeds: [embed] });
    }
};
