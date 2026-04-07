const { EmbedBuilder } = require('discord.js');

const coinSettings = new Map();
const userCoins = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'pay',
            description: 'Pay a member | Payer un membre',
            // Optionnals :
            usage: 'pay <mention / id> <number coins>',
            category: 'coins',
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        if(!guildData.config.coinsOn) return;


        if (isNaN(args[0]) && !message.mentions.members.first()) return message.channel.send(client.lang(guildData.lang).pay.noMember).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        if (isNaN(args[1]) || !args[1]) return message.channel.send(client.lang(guildData.lang).pay.noCoins).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        if (args[1] < 0) return message.channel.send(client.lang(guildData.lang).pay.coinsInf0)
        if (args[1].includes('.')) {
            if ((args[1].split('.')[1].split('').length > 2)) return message.channel.send(client.lang(guildData.lang).pay.coinsDec2)
        }


        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if (member.user.id === message.author.id) return message.channel.send(`Vous ne pouvez pas vous donner vous même des coins à donner`).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
        let receiverCoins = client.getMemberData(message.guild.id, member.user?.id || member.id).coins
        let giverCoins =  client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).coins
        if(!giverCoins) return message.channel.send(client.lang(guildData.lang).pay.noGoinsToGive)
        if(giverCoins < args[1]) return message.channel.send(client.lang(guildData.lang).pay.notEnoughtCoins(args[1]))
        giverCoins -= parseFloat(args[1])
        receiverCoins += parseFloat(args[1])
        try{
            client.getMemberData(message.guild.id, member.user?.id || member.id).updateCoins = receiverCoins
            client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).updateCoins = giverCoins
            await message.lineReply(client.lang(guildData.lang).pay.giveCoins(args[1], member))
            const logs = message.guild.channels.cache.get(guildData.logs);
            if(!logs) return;
            const embed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription(client.lang(guildData.lang).pay.logs(args[1], message.member, member))
                .setTimestamp()
                .setColor(guildData.color)
                .setFooter({ text: client.user.username })
            logs.send({ embeds: [embed] })
        }catch (e) {
            Logger.error('Pay player coins', 'WARNING ERROR')
            console.log(e)
        }

    }
}