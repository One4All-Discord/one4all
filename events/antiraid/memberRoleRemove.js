const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType } = require('discord.js');
const Event = require('../../structures/Handler/Event');


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildMemberRoleRemove',
        });
    }

    async run(client, member, role) {
        let guild = member.guild;
        if (!role.permissions.has(PermissionFlagsBits.KickMembers) || !role.permissions.has(PermissionFlagsBits.BanMembers) || !role.permissions.has(PermissionFlagsBits.Administrator) || !role.permissions.has(PermissionFlagsBits.ManageChannels) || !role.permissions.has(PermissionFlagsBits.ManageGuild) || !role.permissions.has(PermissionFlagsBits.ManageRoles) || !role.permissions.has(PermissionFlagsBits.MentionEveryone)) return;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const guildData = client.getGuildData(guild.id);
        const color = guildData.color
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)


        const antiraidConfig = guildData.antiraid;
        const isOn = antiraidConfig.enable["roleRemove"] !== undefined ? antiraidConfig.enable["roleRemove"] : antiraidConfig.enable["roleAdd"];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: AuditLogEvent.MemberRoleUpdate}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        if(diff > 600 || action.changes[0].key !== "$remove") return;
        if (action.executor.id === client.user.id) return console.log(`No sanction oneforall - ${this.name}`);
        if (guild.ownerId === action.executor.id) return console.log(`No sanction crown - ${this.name}`);

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`} - ${this.name}`);
        if (isWlBypass && !isWl || !isWlBypass) {
            const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)
            try {
                await member.roles.add(role, `OneForAll - Type : Role remove`)
            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if (channel) {
                        channel.send(logs.memberRole(executor, action.target, role.id, color, "Je n'ai pas assé de permissions", "REMOVE"))
                    }
                }
            }
            let sanction = antiraidConfig.config["roleRemove"] || antiraidConfig.config["roleAdd"];

            if (executor.roles.highest.comparePositionTo(guild.members.me.roles.highest) <= 0) {
                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: `OneForAll - Type : roleRemove`})
                } else if (sanction=== 'kick') {
                    executor.kick(
                        `OneForAll - Type: roleRemove `
                    )
                } else if (sanction === 'unrank') {
                    let roles = []
                    await executor.roles.cache
                        .map(role => roles.push(role.id))

                    await executor.roles.remove(roles, `OneForAll - Type: roleRemove`)
                    if (action.executor.bot) {
                        let botRole = executor.roles.cache.filter(r => r.managed)
                        // let r = guild.roles.cache.get(botRole.id)

                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0n, `OneForAll - Type: roleRemove`)
                    }
                }

                if (channel) {
                    channel.send(logs.memberRole(executor, action.target, role.id, color, sanction, "REMOVE"))
                }

            } else {


                if (channel) {
                    channel.send(logs.memberRole(executor, action.target, role.id, color, "Je n'ai pas assé de permissions", "REMOVE"))


                }

            }
        }
    }
}
