const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'unwarn',
            description: "Remove warns of a member | Enlève les warns d'un membre",
            category: 'warn',
            usage: 'unwarn <mention/id> [numeroWarn]',
            clientPermissions : [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages],
            userPermissions: [PermissionFlagsBits.BanMembers],
            cooldown: 4
        });
    }
    async run(client, message,args){
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang)
        const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.reply(lang.warn.noMember)
        let memberWarns = client.getMemberData(message.guild.id, member.user.id || member.id).warns;
        if(memberWarns.length < 1)  return message.reply(lang.warn.nothingToClear)
        const warnToRemove = args[1];
        if(isNaN(warnToRemove) && args[1]) return message.reply(lang.warn.notNumber)
        if(!warnToRemove){
            client.getMemberData(message.guild.id, member.user.id || member.id).deleteWarn()
            return message.reply(lang.warn.successClear(member.user.username))
        }
        if(parseInt(warnToRemove) > memberWarns.length) return message.reply(lang.warn.amountHigherThanWarnTotal)
        const warnToDelete = memberWarns[parseInt(memberWarns)];
        memberWarns = memberWarns.filter(warn => warn !== warnToDelete);
        client.getMemberData(message.guild.id, member.user.id || member.id).updateWarn = memberWarns;
        message.reply(lang.warn.successDelete(member.user.username, warnToRemove))


    }
}
