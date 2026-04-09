const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'clearinvite',
            description: "Clear all invite server or a member  | Supprimé toutes les invites du server ou d'un membre",
            category: 'invite',
            usage: 'clearinvite [mention/id]',
            aliases: ['clearinv'],
            userPermissions: [PermissionFlagsBits.Administrator],
            guildOwnerOnly : true,
            cooldown: 7
        });
    }
    async run(client, message,args){
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang)
        if(!message.mentions.members.first() || message.guild.members.cache.get(args[0])){
            await guildData.clearInvite().then((res) => {
                return message.reply(lang.clearInv.success(message.guild.name))
            })
            message.guild.members.cache.forEach(member => {
                client.getMemberData(message.guild.id, member.user?.id || member.id).clearMemberInvite(false)
            })
        }else{
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
            client.getMemberData(message.guild.id, member.user?.id || member.id).clearMemberInvite(true)
            return message.reply(lang.clearInv.success(member.user.username))
        }

    }
}