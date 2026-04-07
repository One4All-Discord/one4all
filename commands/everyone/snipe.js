const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
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

        const lang = client.lang(guildData.lang)

        function hasDiscordInvite(string) {
            let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

            return discordInvite.test(string);

        }

        const color = guildData.color
        let msg;

        try {
            const {snipes} = message.guild;
            msg = snipes.get(message.channel.id)

        } catch (err) {
            console.error(err)
            return message.channel.send(lang.snipe.error)
        }
        let msgContent = msg.content
        if (hasDiscordInvite(msg.content)) msgContent = msgContent.replace(msgContent, lang.snipe.link)
        const embed = new EmbedBuilder()
            .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL({ size: 256 }) })
            .setDescription(msgContent)
            .setFooter({ text: `${client.user.username} | Date: ${msg.date}` })
            .setColor(`${color}`)
        if (msg.image) embed.setImage(msg.image)
        message.channel.send({ embeds: [embed] })
    }
};

