const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType } = require('discord.js');
const Event = require('../../structures/Handler/Event');

module.exports = class guildUpdate extends Event {
    constructor() {
        super({
            name: 'guildUpdate',
        });
    }

    async run(client, oldGuild, newGuild) {

        if (!oldGuild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const guildData = client.getGuildData(oldGuild.id);
        const color = guildData.color
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)


        const antiraidConfig = guildData.antiraid;
        const isOn = antiraidConfig.enable["nameUpdate"];
        if (!isOn) return;
        let action = await oldGuild.fetchAuditLogs({type: AuditLogEvent.GuildUpdate}).then(async (audit) => audit.entries.first());
        if(action.changes[0].key !== "name") return;
        if (action.executor.id === client.user.id) return console.log(`No sanction oneforall - ${this.name}`);
        if (oldGuild.ownerId === action.executor.id) return console.log(`No sanction crown - ${this.name}`);

        let isGuildOwner = oldGuild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass["nameUpdate"];
        if (isWlBypass) var isWl = oldGuild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `oldGuild owner list or bot owner`} - CHANNEL DELETE`);
        if (isWlBypass && !isWl || !isWlBypass) {
            const member = oldGuild.members.cache.get(action.executor.id) || await oldGuild.members.fetch(action.executor.id)
            const channel = oldGuild.channels.cache.get(antiraidLog)
            const oldName = action.changes[0].old;
            const newName = action.changes[0].new
            try {
                await oldGuild.setName(oldName, `OneForAll - Type: guildUpdate - changeName`)
            } catch (e) {

                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if(channel){
                        channel.send(logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, "Je n'ai pas assé de permissions"))
                    }

                }
            }

            let sanction = antiraidConfig.config["nameUpdate"];


            if (member.roles.highest.comparePositionTo(oldGuild.members.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await oldGuild.members.ban(action.executor.id, {reason: `OneForAll - Type: guildUpdate - changeName`})


                } else if (sanction === 'kick') {
                    member.kick(
                        `OneForAll - Type: guildUpdate - changeName`
                    )


                } else if (sanction === 'unrank') {

                    let roles = []
                    await member.roles.cache
                        .map(role => roles.push(role.id))

                    await member.roles.remove(roles, `OneForAll - Type: guildUpdate - changeName`)
                    if (action.executor.bot) {
                        let botRole = member.roles.cache.filter(r => r.managed)


                        for (const [id] of botRole) {
                            botRole = oldGuild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0n, `OneForAll - Type: guildUpdate - changeName`)
                    }


                }


                if(channel){
                    channel.send(logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, sanction))
                }

            } else {

                if(channel){
                    channel.send(logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, "Je n'ai pas assé de permissions"))
                }
            }
        }
    }
}
