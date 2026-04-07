const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, AuditLogEvent, ChannelType, PermissionFlagsBits } = require('discord.js');


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildMemberRoleAdd',
        });
    }

    async run(client, member, role) {
        let guild = member.guild;
        const guildData = client.getGuildData(guild.id);
        if(!guildData.config) return
        if (!role.permissions.has(PermissionFlagsBits.KickMembers) || !role.permissions.has(PermissionFlagsBits.BanMembers) || !role.permissions.has(PermissionFlagsBits.Administrator) || !role.permissions.has(PermissionFlagsBits.ManageChannels) || !role.permissions.has(PermissionFlagsBits.ManageGuild) || !role.permissions.has(PermissionFlagsBits.ManageRoles) || !role.permissions.has(PermissionFlagsBits.MentionEveryone)) return;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const color = guildData.color
        let {modLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)
        if (modLog === "Non définie") return;


        let action = await guild.fetchAuditLogs({type: AuditLogEvent.MemberRoleUpdate}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        if (diff > 600 || action.changes[0].key !== "$add") return;
        if (action.executor.id === client.user.id) return

        const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
        const channel = guild.channels.cache.get(modLog)


        if (channel && !channel.deleted) {
            channel.send({ embeds: [logs.memberRole(executor, action.target, role.id, color, '', "ADD")] })
        }


    }
}