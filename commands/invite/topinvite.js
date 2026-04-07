const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'topinvite',
            description: 'Display the 10 member invites || Affiche le top 10 des invits',
            category: 'invite',
            usage: 'topinvite',
            aliases: ['invlb', 'topinv'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 3
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lb = await guildData.topInvite()
        if(!lb) return message.channel.send(`Can't find top 10 invites`)
        const color = guildData.color;
        const embed = new EmbedBuilder()
            .setTitle(`Top 10 invites ${message.guild.name}`)
            .setDescription(lb.map((invite, i) => `${i+1} - <@${invite.userId}> : **${invite.count.join}** join,**${invite.count.leave}** leave, **${invite.count.fake}** fake, **${invite.count.bonus}** bonus\n`))
            .setTimestamp()
            .setFooter({ text: message.guild.name })
            .setColor(color)
        await message.channel.send({ embeds: [embed] })
    }
}