const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class Snipe extends Command {
    constructor() {
        super({
            name: 'snipe',
            description: 'Show the last deleted message in a channel',
            usage: 'snipe',
            category: 'everyone',
            userPermissions: [PermissionFlagsBits.ManageMessages],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);

        function hasDiscordInvite(string) {
            return /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i.test(string);
        }

        let msg;
        try {
            const { snipes } = message.guild;
            msg = snipes.get(message.channel.id);
        } catch (err) {
            console.error(err);
            return message.reply(lang.snipe.error);
        }

        let msgContent = msg.content;
        if (hasDiscordInvite(msg.content)) msgContent = msgContent.replace(msgContent, lang.snipe.link);

        const embed = new Embed(client, guildData)
            .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL({ size: 256 }) })
            .setDescription(msgContent)
            .setFooter({ text: `Supprimé le ${msg.date}` });
        if (msg.image) embed.setImage(msg.image);
        message.reply({ embeds: [embed] });
    }
};
