const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'unmute',
            description: 'Unmute a member | Unmute un membre',
            usage: 'unmute <mention/id>',
            category: 'moderation',
            clientPermissions: [PermissionFlagsBits.MuteMembers],
            userPermissions: [PermissionFlagsBits.MuteMembers],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const guildData = client.getGuildData(message.guild.id);
    const lang = client.lang(guildData.lang)
    const color = guildData.color
    let isSetup = message.guild.setup;
    if(!isSetup) return message.channel.send(lang.error.noSetup);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(lang.unmute.noMember)
    const muteRole = message.guild.roles.cache.get(guildData.config.muteRoleId);
    if(!muteRole) return message.channel.send(lang.unmute.errorCantFindRole);
    if(!member.roles.cache.has(muteRole.id)) return message.channel.send(lang.unmute.errorAlreadyUnMute(member));
    member.roles.remove(muteRole).then(() =>{
        const { logs } = lang
        const { modLog } = guildData.logs;
        const channel = message.guild.channels.cache.get(modLog);
        if(channel && !channel.deleted){
            channel.send(logs.unmute(member.user, "commande", color))
        }
        message.channel.send(lang.unmute.success(member));
        guildData.updateMute(member.id)

    })
}}
