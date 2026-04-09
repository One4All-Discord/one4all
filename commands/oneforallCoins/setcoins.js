const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'setcoins',
            description: "Set the coins of somebody | Définie les coins de quelqu'un",
            category: 'coins',
            usage: 'setcoins <mention/id>',
            userPermissions: [PermissionFlagsBits.Administrator],
            guildOwnerOnly : true,
            cooldown: 4
        });
    }
    async run(client, message,args){
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
        if(!member) return message.reply(`Vous devez spécifier un membre`)
        if(isNaN(args[1])) return message.reply(`Uniqement des nombres en args 2`)
        const money = parseFloat(args[1]).toFixed(2)
        client.getMemberData(message.guild.id, member.user?.id || member.id).updateCoins = money;
        await message.reply(`Vous avez définie le nombre de coins de ${member} à  ${money}`)
    }
}