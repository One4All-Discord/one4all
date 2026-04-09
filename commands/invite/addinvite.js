const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'addinvite',
            description: 'Add some invites to a member | Ajouter des invites a un membre',
            category: 'invite',
            aliases: ['addinv'],
            usage: 'addinvite <mention/ping> <amount>',
            userPermissions: [PermissionFlagsBits.Administrator],
            cooldown: 3
        });
    }
    async run(client, message,args){
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const member = message.mentions.members.first() || await message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0])

        if(!member) return message.reply(lang.addinvite.noMember)
        const numberToAdd = args[1];
        if(!numberToAdd) return message.reply(lang.addinvite.noNumber)
        let count = client.getMemberData(message.guild.id, member.user?.id || member.id).invite;
        count.join += parseInt(numberToAdd);
        count.bonus += parseInt(numberToAdd)
        client.getMemberData(message.guild.id, member.user?.id || member.id).updateInvite = count;
        message.reply(lang.addinvite.success(numberToAdd, member.user.username))


    }
}