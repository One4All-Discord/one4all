const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const userCoins = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'leaderboard',
            description: 'Show the top 10 member with the most coins | Affiche le top 10 des membres avec le plus de coins',
            // Optionnals :
            usage: 'leaderboard',
            category: 'coins',
            aliases: ['lb', 'classement'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        if (!guildData.config.coinsOn) return;
        const lang = client.lang(guildData.lang)
        const lb = await guildData.getLeaderBoard()
        const color = guildData.color;
        const embed = new EmbedBuilder()
            .setTitle(lang.lb.title)
            .setDescription(lb.map((user, i) => `${i + 1} . <@${user[1].userId}> : ${user[1].coins} coins`))
            .setFooter({ text: `OneForAll coins` })
            .setColor(color)
        message.channel.send({ embeds: [embed] })


    }
}