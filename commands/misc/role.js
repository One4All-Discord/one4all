const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'role',
            description: 'Add / Remove a role of a member | Ajouter ou enlever un role a un membre',
            usage: 'role <add / remove > <role> <mention / id>',
            category: 'misc',
            userPermissions: [PermissionFlagsBits.ManageRoles],
            aliases: ['rl'],
            clientPermissions: [PermissionFlagsBits.ManageRoles],
            cooldown: 5

        });
    }
    async run(client, message,args){
        const guildData = client.getGuildData(message.guild.id);

    const lang = client.lang(guildData.lang)
    const color = guildData.color
    const add = args[0] === 'add';
        const remove = args[0] === 'remove';
        // if(!message.member.hasPermission(PermissionFlagsBits.ManageRoles)) return message.channel.send("▫️ \`ERREUR\` Vous n'avez pas la permission requise \`MANAGER_ROLES\`");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
        if(!role) return message.channel.send("Le rôle spécifié n'existe pas.")
        if(role.comparePositionTo(message.member.roles.highest) >= 0) return message.reply(`▫️ \`ERREUR\` Vous ne pouvez pas ajouter le rôle **\`${role.name}\`** à **\`${member.user.username}\`** car vos permissions sont plus basses que ce rôle`)
        if(add && !member) return message.channel.send("▫️ \`ERREUR\` Vous devez specifier un membre à ajouter le rôle")
        if(add && member && !role) return message.channel.send(`▫️ \`ERREUR\` Vous devez specifier un rôle à ajouter à ${membre}`)
        if(member.user.id === message.author.id) return message.channel.send(`▫️ \`ERREUR\` Vous ne pouvez pas vous ajoutez vous même le rôle (${role})`)
        if(!args[0]){
 const hEmbed = new EmbedBuilder()
            .setAuthor({ name: lang.role.author, iconURL: `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588` })
            .setColor(`${color}`)
            .setTimestamp()
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter({ text: lang.role.author, iconURL: `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588` })
            .addFields({ name: '▫️ Rôle:', value: `[\`role add\`](https://discord.gg/h69YZHB7Nh), [\`role remove\`](https://discord.gg/h69YZHB7Nh)` })
      message.channel.send({ embeds: [hEmbed] }); 
        }else if(add){
            if(member.roles.cache.has(role.id)) return message.channel.send(lang.role.errorAlreadyRl(member, role))
            member.roles.add(role).then(() =>{
                message.channel.send(lang.role.successAdd(member, role))
            }).catch((err) =>{
                console.log(err)
                message.channel.send(lang.role.errorCantRm(member))
            })
        }else if(remove){
            if(!member.roles.cache.has(role.id)) return message.channel.send(lang.errorNoRl(member, role))
            member.roles.remove(role).then(() =>{
                message.channel.send(lang.role.successRemove(member, role))
            }).catch((err) =>{
                console.log(err)
                message.channel.send(lang.role.error(member))
            })
        }
}};



