const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
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
        const color = guildData.color
        const lang = client.lang(guildData.lang)
        const embed = new EmbedBuilder()
            .setAuthor({ name: lang.support.support, iconURL: `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588` })
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter({ text: lang.support.support, iconURL: `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588` })
            .setDescription(`[\`${lang.clic}\`](https://discord.gg/h69YZHB7Nh)`)
        message.channel.send({ embeds: [embed] });
    }
};

