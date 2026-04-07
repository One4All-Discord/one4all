
const logsChannelId = new Map();
const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'derank',
            description: "Remove all roles of a member | Enlever tout les rôles d'un membre",
            usage: 'derank <mention / id>',
            category: 'moderation',
            aliases: ['unrank'],
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.ManageRoles],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const guildData = client.getGuildData(message.guild.id);
    const lang = client.lang(guildData.lang)
    const color = guildData.color
    let memberss = await message.mentions.members.first()
    let member;
    await message.guild.members.fetch().then((members) =>{
        member = members.get(args[0]) || members.get(memberss.id)
    });
    if (!member) return message.channel.send(lang.derank.errorNoMember)
    if(member.user.id === client.user.id) return message.channel.send(lang.derank.errorUnrankMe)
    if(member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0 && message.guild.ownerId != message.author.id)  return message.channel.send(lang.derank.errorRl(member))
    if (member.user.id === message.author.id) return message.channel.send(lang.derank.errorUnrankself);
    let roles = []
    let role = await member.roles.cache
        .map(role => roles.push(role.id))
    role
    if(roles.length === 1) return message.channel.send(lang.derank.errorNoRl(member));
    member.roles.remove(roles, lang.derank.reason(message.member)).then(() =>{
        let logChannelId = logsChannelId.get(message.guild.id);
        if (logChannelId != undefined) {
            let logChannel = message.guild.channels.cache.get(logChannelId)
            const logsEmbed = new EmbedBuilder()
				.setTitle("\`❌\` Derank d'un membre")
				.setDescription(`
					\`👨‍💻\` Auteur : **${message.author.username}** \`(${message.author.id})\` a derank :\n
                    \`\`\`${member.user.username} (${member.user.id})\`\`\`

					`)
				.setTimestamp()
				.setFooter({ text: "🕙" })
				.setColor(`${color}`)

				.setTimestamp()
				.setFooter({ text: "🕙" })
				.setColor(`${color}`)
			logChannel.send({ embeds: [logsEmbed] })
        }
        return message.channel.send(lang.derank.success(member))
    })
}}
