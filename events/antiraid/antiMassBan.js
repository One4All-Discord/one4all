const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType } = require('discord.js');
const Event = require('../../structures/Handler/Event');

module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildBanAdd',
        });
    }
    async run(client, ban){
        const guild = ban.guild;
        const user = ban.user;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
        const guildData = client.getGuildData(guild.id);
        const color = guildData.color;
        const antiraidConfig = guildData.antiraid;
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)
        const isOn = antiraidConfig.enable["antiMassBan"];
        if(!isOn) return;
        let action = await guild.fetchAuditLogs({type: AuditLogEvent.MemberBanAdd}).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id)  return console.log(`No sanction oneforall - MassBAN`);
        if(guild.ownerId === action.executor.id) return console.log(`No sanction crown - MassBAN`);

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass["antiMassBan"];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`} - CHANNEL CREATE`);


        if (isWlBypass && !isWl || !isWlBypass) {
            const banLimit = antiraidConfig.config["antiMassBanLimit"]
            const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)

            if(!guildData.antiraidLimit.has(action.executor.id)){
                await guildData.updateAntiraidLimit(action.executor.id, 0, 0, 0);
            }
            const { deco, ban: banCount, kick } = guildData.antiraidLimit.get(action.executor.id)

            if(banCount + 1 < banLimit){
                await guildData.updateAntiraidLimit(action.executor.id, deco, banCount+1, kick);
                if(logsChannel && !logsChannel.deleted){
                    logsChannel.send(logs.targetExecutorLogs("ban", member, action.target, color, `${banCount + 1 === banLimit ? `Aucun ban restant` : `${banCount+1}/${banLimit}`} before sanction`))
                }
            }else{
                let sanction = antiraidConfig.config["antiMassBan"];


                if (member.roles.highest.comparePositionTo(guild.members.me.roles.highest) <= 0) {
                    if (sanction === 'ban') {
                        await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : antiMassBan'})
                    } else if (sanction === 'kick') {
                        guild.members.cache.get(action.executor.id).kick(
                            `OneForAll - Type: antiMassBan `
                        )
                    } else if (sanction === 'unrank') {
                        let roles = []
                        await member.roles.cache
                            .map(role => roles.push(role.id))

                            member.roles.remove(roles, `OneForAll - Type: antiMassBan`)
                        if (action.executor.bot) {
                            let botRole = member.roles.cache.filter(r => r.managed)


                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            await botRole.setPermissions(0n, `OneForAll - Type: antiMassBan`)
                        }
                    }
                    if(logsChannel && !logsChannel.deleted){
                        logsChannel.send(logs.targetExecutorLogs("ban", member, action.target, color, sanction))
                    }
                    await guildData.updateAntiraidLimit(action.executor.id, deco, 0, kick)

                }else{
                    if(logsChannel && !logsChannel.deleted){
                        logsChannel.send(logs.targetExecutorLogs("ban", member, action.target, color, "Je n'ai pas assé de permissions"))
                    }
                    await guildData.updateAntiraidLimit(action.executor.id, deco, 0, kick)

                }
            }


        }
    }
}
