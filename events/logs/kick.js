const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, AuditLogEvent, ChannelType, PermissionFlagsBits } = require('discord.js');


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildMemberRemove',
        });
    }
    async run(client, member){
        const { guild } = member
        const guildData = client.getGuildData(guild.id);
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        let { modLog } = guildData.logs;
        const { logs } = client.lang(guildData.lang)
        if(modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: AuditLogEvent.MemberKick}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction

        if(diff > 1000) return
        const channel = guild.channels.cache.get(modLog);
        if(channel){
            const color = guildData.color

            const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            channel.send({ embeds: [logs.targetExecutorLogs('kick',executor, action.target, color)] })
        }
    }
}