const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType } = require('discord.js');
const Event = require('../../structures/Handler/Event');

module.exports = class channelUpdate extends Event {
    constructor() {
        super({
            name: 'channelUpdate',
        });
    }

    async run(client, oldChannel, newChannel) {
        let guild = oldChannel.guild;

        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const guildData = client.getGuildData(guild.id);
        const color = guildData.color
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)


        const antiraidConfig = guildData.antiraid;
        const isOn = antiraidConfig.enable[this.name];
        if(!isOn) return;
        let action = await guild.fetchAuditLogs({type: AuditLogEvent.ChannelUpdate}).then(async (audit) => audit.entries.first());

        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction

        if (action.executor.id === client.user.id)  return console.log(`No sanction oneforall - ${this.name}`);
        if(guild.ownerId === action.executor.id) return console.log(`No sanction crown - ${this.name}`);

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`} - CHANNEL DELETE`);
        if (diff <= 1000 ) {

           if (isWlBypass && !isWl || !isWlBypass) {
               const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
               const channel = guild.channels.cache.get(antiraidLog)
                try {
                    oldChannel.edit({
                        type: oldChannel.type,
                        name: oldChannel.name,
                        nsfw: oldChannel.nsfw,
                        topic: oldChannel.topic,
                        bitrate: oldChannel.bitrate,
                        position: oldChannel.rawPosition,
                        parent: oldChannel.parent,
                        userLimit: oldChannel.userLimit,
                        manageable: oldChannel.manageable,
                        rateLimitPerUser: oldChannel.rateLimitPerUser
                    }, `OneForAll - Type : ${this.name}`)
                } catch (e) {
                    if (e.toString().toLowerCase().includes('missing permissions')) {
                        if (channel) {
                            channel.send(logs.edtionRole(member, oldChannel.id, oldChannel.name, newChannel.name, color, "Je n'ai pas assé de permissions"))

                        }
                    }
                }

               let sanction = antiraidConfig.config[this.name];

                if (member.roles.highest.comparePositionTo(guild.members.me.roles.highest) <= 0) {
                    if (sanction === 'ban') {
                        await guild.members.ban(action.executor.id, {reason: `OneForAll - Type : ${this.name}`})
                    } else if (sanction === 'kick') {
                        member.kick(
                            `OneForAll - Type: channelUpdate `
                        )
                    } else if (sanction === 'unrank') {
                        let roles = []
                        await member.roles.cache
                            .map(role => roles.push(role.id))

                        member.roles.remove(roles, `OneForAll - Type: ${this.name}`)
                        if (action.executor.bot) {
                            let botRole = member.roles.cache.filter(r => r.managed)
                            // let r = guild.roles.cache.get(botRole.id)

                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            await botRole.setPermissions(0n, `OneForAll - Type: channelUpdate `)
                        }
                    }

                    if (channel) {
                        channel.send(logs.edtionRole(member, newChannel.id, oldChannel.name, newChannel.name, color, sanction))
                    }

                } else {


                    if (channel) {
                        channel.send(logs.edtionRole(member, newChannel.id, oldChannel.name, newChannel.name, color,"Je n'ai pas assé de permissions"))

                    }

                }


            }
        }


    }
}
