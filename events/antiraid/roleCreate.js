const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType } = require('discord.js');
const Event = require('../../structures/Handler/Event');

module.exports = class roleCreate extends Event {
    constructor() {
        super({
            name: 'roleCreate',
        });
    }

    async run(client, role) {
        if(role.managed) return;
        let guild = role.guild;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const guildData = client.getGuildData(guild.id);
        const color = guildData.color
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)


        const antiraidConfig = guildData.antiraid;
        const isOn = antiraidConfig.enable[this.name];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: AuditLogEvent.RoleCreate}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return console.log(`No sanction oneforall - ${this.name}`);
        if (guild.ownerId === action.executor.id) return console.log(`No sanction crown - ${this.name}`);

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`} - ROLE_CREATEE`);
        if (isWlBypass && !isWl || !isWlBypass) {
            const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)
            try {
                role.delete(`OneForall - Type : roleCreate`);

            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {

                    if(channel){
                        channel.send(logs.roleCreate(member, role.name, role.id,color, "Je n'ai pas assé de permissions"))
                    }


                }
            }

            let sanction = antiraidConfig.config[this.name];

            if (member.roles.highest.comparePositionTo(role.guild.members.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: "OneForAll - Type : roleCreate"})
                } else if (sanction === 'kick') {
                    member.kick(
                        `OneForAll - Type: roleCreate `
                    )
                } else if (sanction === 'unrank') {
                    let roles = []
                  await member.roles.cache
                        .map(role => roles.push(role.id))

                    await member.roles.remove(roles, `OneForAll - Type: roleCreate`)
                    if (action.executor.bot) {
                        let botRole = member.roles.cache.filter(r => r.managed)

                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0n, `OneForAll - Type: roleCreate`)
                    }
                }
               if(channel){
                   channel.send(logs.roleCreate(member, role.name, role.id, color, sanction))
               }
            } else {

                if(channel){
                    channel.send(logs.roleCreate(member, role.name,role.id, color, "Je n'ai pas assé de permissions"))
                }
            }
        }
    }
}
