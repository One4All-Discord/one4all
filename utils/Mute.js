const moment = require('moment')

module.exports = {
    async startChecking(client) {
        setInterval(async () => {
            const allMutedGuild = client.guilds.cache.filter(guild => client.getGuildData(guild.id).muted.size !== 0);
            for await(const [, guild] of allMutedGuild){
                const guildData = client.getGuildData(guild.id);
                if (!guildData?.config?.muteRoleId) continue;
                const { muted } = guildData;
                const now = moment().utc().format()
                for await(let [id, expireAt] of muted){
                    if(expireAt === "lifetime") return;
                    expireAt = moment.utc(expireAt).format()
                    if(now > expireAt){
                        await guildData.updateMute(id).then(() => {
                            const member = guild.members.cache.get(id);
                            if(!member) return;
                            const muteRole = guild.roles.cache.get(guildData.config.muteRoleId)
                            if(!muteRole) return;
                            if(member.roles.cache.has(muteRole.id)) member.roles.remove(muteRole, `Auto unmute `)
                            const { logs } = client.lang(guildData.lang)
                            const { modLog } = guildData.logs;
                            const channel = guild.channels.cache.get(modLog);
                            if(channel && !channel.deleted){
                                channel.send(logs.unmute(member.user, moment(expireAt).tz("Paris").format("DD/MM/YYYY HH:mm:ss"), guildData.color))
                            }
                        })
                    }
                }

            }
        }, 5000)
    }
}
