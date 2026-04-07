const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'allbans',
            description: 'Show all bans members | Afficher tout les membres banni',
            usage: 'allbans',
            category: 'moderation',
            aliases: ['banlist'],
            clientPermissions: [PermissionFlagsBits.BanMembers],
            userPermissions: [PermissionFlagsBits.BanMembers],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const guildData = client.getGuildData(message.guild.id);
    const color = guildData.color
    const lang = client.lang(guildData.lang)


    message.guild.bans.fetch()
        .then(banned => {
            let list = banned.map(ban => ban.user.username).join('\n');
            const color = guildData.color

            if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;
            const embed = new EmbedBuilder()
                .setTimestamp()
                .setFooter({ text: client.user.username })
                .setTitle(lang.banlist.title(message.guild))
                .setDescription(lang.banlist.description(banned, list))
                .setColor(`${color}`)
            const embedinf = new EmbedBuilder()
                .setTimestamp()
                .setTitle(lang.banlist.title(message.guild))
                .setFooter({ text: client.user.username })
                .setDescription(lang.banlist.descriptionInf(banned))
                .setColor(`${color}`)
            if (list.length > 0) {
                message.channel.send({ embeds: [embed] });

            } else {
                message.channel.send({ embeds: [embedinf] });

            }
        })

}}
