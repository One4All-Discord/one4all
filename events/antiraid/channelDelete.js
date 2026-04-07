const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType } = require('discord.js');
const Event = require('../../structures/Handler/Event');


module.exports = class channelDelete extends Event {
    constructor() {
        super({
            name: 'channelDelete',
        });
    }

    async run(client, channel) {
        let guild = channel.guild
        if (channel.type === ChannelType.DM) return;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const guildData = client.getGuildData(guild.id);
        const color = guildData.color;
        const antiraidConfig = guildData.antiraid;
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)
        const isOn = antiraidConfig.enable[this.name];
        if(!isOn) return;

        let action = await channel.guild.fetchAuditLogs({type: AuditLogEvent.ChannelDelete}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id)  return console.log(`No sanction oneforall - CHANNEL Delete`);
        if(guild.ownerId === action.executor.id) return console.log(`No sanction crown - CHANNEL Delete`);

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`} - CHANNEL CREATE`);


        if (isWlBypass && !isWl || !isWlBypass) {
            const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)

            try {
                await guild.channels.create({
                    name: channel.name,
                    reason: `OneForall - Type : ${this.name}`,
                    type: channel.type,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate,
                    userLimit: channel.userLimit,
                    parent: channel.parent,
                    permissionOverwrites: channel.permissionOverwrites,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    position: channel.rawPosition

                })
            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if(logsChannel && !logsChannel.deleted){
                        logsChannel.send(logs.channelDelete(member, channel.name, channel.id, color, "Je n'ai pas assé de permissions"))
                    }
                }
            }

            let sanction = antiraidConfig.config[this.name];


            if (member.roles.highest.comparePositionTo(channel.guild.members.me.roles.highest) <= 0) {
                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : channelDelete'})
                } else if (sanction === 'kick') {
                    guild.members.cache.get(action.executor.id).kick(
                        `OneForAll - Type: channelDelete `
                    )
                } else if (sanction === 'unrank') {
                    let roles = []
                    member.roles.cache
                        .map(role => roles.push(role.id))

                    await member.roles.remove(roles, `OneForAll - Type: channelDelete`)
                    if (action.executor.bot) {
                        let botRole = member.roles.cache.filter(r => r.managed)


                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0n, `OneForAll - Type: channelDelete`)
                    }
                }


                if(logsChannel && !logsChannel.deleted) logsChannel.send(logs.channelDelete(member, channel.name, channel.id, color, sanction))
            } else {

                if(logsChannel && !logsChannel.deleted){
                    logsChannel.send(logs.channelDelete(member, channel.name, channel.id, color, "Je n'ai pas assé de permissions"))
                }
            }
        }

    }
};
