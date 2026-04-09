const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class BanList extends Command {
    constructor() {
        super({
            name: 'allbans',
            description: 'Show all bans members | Afficher tout les membres banni',
            usage: 'allbans',
            category: 'moderation',
            aliases: ['banlist'],
            clientPermissions: [PermissionFlagsBits.BanMembers],
            userPermissions: [PermissionFlagsBits.BanMembers],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);

        message.guild.bans.fetch().then(banned => {
            let list = banned.map(ban => ban.user.username).join('\n');
            if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;

            if (list.length > 0) {
                const embed = new Embed(client, guildData)
                    .setAuthor({ name: `🔨  ${lang.banlist.title(message.guild)}`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(lang.banlist.description(banned, list));
                message.reply({ embeds: [embed] });
            } else {
                const embed = new Embed(client, guildData)
                    .setWarning()
                    .setAuthor({ name: `🔨  ${lang.banlist.title(message.guild)}`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(lang.banlist.descriptionInf(banned));
                message.reply({ embeds: [embed] });
            }
        });
    }
};
