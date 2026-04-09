const warnSanction = new Map();
const muteRoleId = new Map();
const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'warn',
            description: 'Warn a member | Warn un membre',
            usage: 'warn <member/id> <reason>',
            category: 'warn',
            userPermissions: [PermissionFlagsBits.BanMembers],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const color = guildData.color;
        const lang = client.lang(guildData.lang);
        const warnedMember = await message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
        if (!warnedMember) return message.reply(lang.warn.noMember);
        let reason = args.slice(1).join(' ');
        if (!reason) reason = lang.warn.noReason;
        let memberWarns = client.getMemberData(message.guild.id, warnedMember.user.id || warnedMember.id).warns;
        memberWarns.push(reason);
        client.getMemberData(message.guild.id, warnedMember.user.id || warnedMember.id).updateWarn = memberWarns
        await warnedMember.user.send(lang.warn.warnDm(message.author.username, reason, memberWarns.length)).catch(() => {});
        message.reply(lang.warn.warnSuccess(warnedMember.user.username || warnedMember.username, reason, memberWarns.length))

        const {ban, kick, mute} = guildData.warns;
        if (memberWarns.length >= ban && warnedMember.bannable && ban !== 0) {
            await warnedMember.user.send(lang.warn.banDm(memberWarns.length, message.guild.name)).catch(() => {});
            message.guild.members.ban(warnedMember, {reason: `Limite de warn ban atteinte (${ban}) ${warnedMember.user.username} a donc été ban`}).then(async () => {
                client.getMemberData(message.guild.id, warnedMember.user.id || warnedMember.id).deleteWarn()
            })
        }else if(memberWarns.length >= kick && warnedMember.kickable && kick !== 0){
            await warnedMember.user.send(lang.warn.kickDm(memberWarns.length, message.guild.name)).catch(() => {});
            message.guild.members.cache.get(warnedMember.user.id).kick({reason: `Limite de warn kick atteinte (${kick}) ${warnedMember.user.username} a donc été kick`})
        }else if (memberWarns.length >= mute && mute !== 0) {
            let isSetup = message.guild.setup;
            if (!isSetup) return message.reply(lang.error.noSetup);
            await warnedMember.user.send(lang.warn.muteDm(memberWarns.length, message.guild.name)).catch(() => {});
            if (!warnedMember.roles.cache.has(guildData.config.muteRoleId)) {
                warnedMember.roles.add(guildData.config.muteRoleId, {reason: `Limite de warn mute atteinte (${mute}) ${warnedMember.user.username} a donc été mute`})

            }
        }
    }
}
