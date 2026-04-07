const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, AuditLogEvent, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = class guildVanityUpdate extends Event {
    constructor() {
        super({
            name: 'guildVanityUpdate',
        });
    }

    async run(client, guild, oldVanityURL, newVanityURL) {
        const guildData = client.getGuildData(guild.id);
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        let { modLog } = guildData.logs;
        const { logs } = client.lang(guildData.lang)
        if(modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: AuditLogEvent.GuildUpdate}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        const channel = guild.channels.cache.get(modLog);
        if(channel){
            const color = guildData.color

            const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id);
            channel.send({ embeds: [logs.guildVanityUpdate(executor, oldVanityURL, newVanityURL, guild.id, color)] })
        }
    }
}
