const Embed = require('../../structures/Embed');
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
        // if(!message.member.hasPermission(PermissionFlagsBits.ManageRoles)) return message.reply("▫️ \`ERREUR\` Vous n'avez pas la permission requise \`MANAGER_ROLES\`");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
        if(!role) return message.reply("Le rôle spécifié n'existe pas.")
        if(role.comparePositionTo(message.member.roles.highest) >= 0) return message.reply(`▫️ \`ERREUR\` Vous ne pouvez pas ajouter le rôle **\`${role.name}\`** à **\`${member.user.username}\`** car vos permissions sont plus basses que ce rôle`)
        if(add && !member) return message.reply("▫️ \`ERREUR\` Vous devez specifier un membre à ajouter le rôle")
        if(add && member && !role) return message.reply(`▫️ \`ERREUR\` Vous devez specifier un rôle à ajouter à ${membre}`)
        if(member.user.id === message.author.id) return message.reply(`▫️ \`ERREUR\` Vous ne pouvez pas vous ajoutez vous même le rôle (${role})`)
        if(!args[0]){
 const hEmbed = new Embed(client, guildData)
            .setAuthor({ name: lang.role.author, iconURL: client.user.displayAvatarURL() })
            .setFooter({ text: lang.role.author, iconURL: client.user.displayAvatarURL() })
            .addFields({ name: '▫️ Rôle:', value: `[\`role add\`](https://discord.gg/TfwGcCjyfp), [\`role remove\`](https://discord.gg/TfwGcCjyfp)` })
      message.reply({ embeds: [hEmbed] }); 
        }else if(add){
            if(member.roles.cache.has(role.id)) return message.reply(lang.role.errorAlreadyRl(member, role))
            member.roles.add(role).then(() =>{
                message.reply(lang.role.successAdd(member, role))
            }).catch((err) =>{
                console.log(err)
                message.reply(lang.role.errorCantRm(member))
            })
        }else if(remove){
            if(!member.roles.cache.has(role.id)) return message.reply(lang.errorNoRl(member, role))
            member.roles.remove(role).then(() =>{
                message.reply(lang.role.successRemove(member, role))
            }).catch((err) =>{
                console.log(err)
                message.reply(lang.role.error(member))
            })
        }
}};



