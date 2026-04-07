const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, AuditLogEvent, ChannelType, PermissionFlagsBits } = require('discord.js');


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
        });
    }

    async run(client, oldState, newState) {
        const guild = oldState.guild;
        const guildData = client.getGuildData(guild.id);
        if(!guildData.config) return
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        let {voiceLog} = guildData.logs;
        const {logs} = client.lang(guildData.lang)
        if (voiceLog === "Non définie") return voiceLog = null;
        // const action = await guild.fetchAuditLogs({type: AuditLogEvent.MemberBanAdd}).then(async (audit) => audit.entries.first());
        // if (action.executor.id === client.user.id) return;
        const color = guildData.color
        const channel = guild.channels.cache.get(voiceLog);
        if(!channel) return;
        if (oldState.channelId == null && newState.channelId != null) {
            // connect
            channel.send({ embeds: [logs.voiceConnect(oldState.member, newState.channelId, color)] })
        }
        if (oldState.channelId != null && newState.channelId == null) {
            channel.send({ embeds: [logs.voiceLeave(oldState.member, oldState.channelId, color)] })
            // disconnect


        }
        if (oldState.channelId != null && newState.channelId != null && oldState.channelId !== newState.channelId) {
            let action = await oldState.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberMove,
            }).then(async (audit) => audit.entries.first());
            const {executor, target} = action
            // self move
            const member = guild.members.cache.get(executor.id)
            if(!action || executor.id === oldState.id){
                return channel.send({ embeds: [logs.voiceChange(member, member.user, oldState.channelId, newState.channelId, color)] })

            }

            if (action.extra.channel.id !== oldState.id && executor.id !== oldState.id) {
                const user = client.users.cache.get(oldState.id)
                channel.send({ embeds: [logs.voiceChange(member, user, oldState.channelId, newState.channelId, color)] })


            }


        }
        if (!oldState.selfMute && newState.selfMute && oldState.channelId != null) {
            channel.send({ embeds: [logs.voiceMute(oldState.member, newState.channelId, color)] })
        }
        if (oldState.selfMute && !newState.selfMute && newState.channelId != null) {
            channel.send({ embeds: [logs.voiceUnMute(oldState.member, newState.channelId, color)] })
        }


    }
}