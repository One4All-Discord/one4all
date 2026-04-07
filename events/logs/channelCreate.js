const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, AuditLogEvent, ChannelType, PermissionFlagsBits } = require('discord.js');


module.exports = class channelCreate extends Event {
    constructor() {
        super({
            name: 'channelCreate',
        });
    }

    async run(client, channel) {
        let guild = channel.guild
        const guildData = client.getGuildData(guild.id);
        if (channel.type === ChannelType.DM) return;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const color = guildData.color;
        const antiraidConfig = guild.antiraid;
        let {modLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)
        if (modLog === "Non définie") return

        let action = await channel.guild.fetchAuditLogs({type: AuditLogEvent.ChannelCreate}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return

        const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
        const logsChannel = guild.channels.cache.get(modLog)


        if (logsChannel && !logsChannel.deleted) logsChannel.send(logs.channelCreate(member, channel.name, channel.id, color))

    }
};
