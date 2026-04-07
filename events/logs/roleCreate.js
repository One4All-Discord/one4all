const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, AuditLogEvent, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = class roleCreate extends Event {
    constructor() {
        super({
            name: 'roleCreate',
        });
    }

    async run(client, role) {
        if (role.managed) return;
        let guild = role.guild;
        const guildData = client.getGuildData(guild.id);
        if(!guildData.config) return
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const color = guildData.color
        let {modLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)

        if(modLog === "Non définie") return

        let action = await guild.fetchAuditLogs({type: AuditLogEvent.RoleCreate}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return

        const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
        const channel = guild.channels.cache.get(modLog)

        if (channel && !channel.deleted) {
            channel.send({ embeds: [logs.roleCreate(member, role.name, role.id, color)] })
        }


    }
}