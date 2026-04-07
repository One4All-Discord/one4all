const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, AuditLogEvent, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = class messageUpdate extends Event {
    constructor() {
        super({
            name: 'messageUpdate',
        });
    }

    async run(client, oldMessage, newMessage) {
        if (!oldMessage.guild) return;
        const guildData = client.getGuildData(oldMessage.guild.id);
        if (!oldMessage.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        if (!oldMessage.author) return;

        if (oldMessage.author.bot || newMessage.author.bot) return;
        if (!newMessage.guild) return;
        if(oldMessage.embeds.length < 1 && newMessage.embeds.length > 0) return;
        if(!guildData.config) return
        const {logs} = client.lang(guildData.lang);
        let {msgLog} = guildData.logs;
        if (msgLog === "Non définie") return msgLog = null;
        const channel = oldMessage.guild.channels.cache.get(msgLog);
        if (channel) {
            const color = guildData.color
            const link = `https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`
            const executor = oldMessage.member
            channel.send({ embeds: [logs.editionMsg(executor, oldMessage.content, newMessage.content, color, link)] })
        }
    }
}
