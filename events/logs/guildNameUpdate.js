const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, AuditLogEvent, ChannelType, PermissionFlagsBits } = require('discord.js');


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildUpdate',
        });
    }
    async run(client, oldGuild, newGuild){
        const guildData = client.getGuildData(oldGuild.id);
        if (!oldGuild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        let { modLog } = guildData.logs;
        const { logs } = client.lang(guildData.lang)
        if(modLog === "Non définie") return modLog = null;
        const action = await oldGuild.fetchAuditLogs({type: AuditLogEvent.GuildUpdate}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        if(action.changes[0].key !== "name") return
        const channel = oldGuild.channels.cache.get(modLog);
        if(channel){
            const color = guildData.color
            const executor = oldGuild.members.cache.get(action.executor.id);
            channel.send({ embeds: [logs.guildNameUpdate(executor, oldGuild.name, newGuild.name, oldGuild.id, color)] })
        }
    }
}