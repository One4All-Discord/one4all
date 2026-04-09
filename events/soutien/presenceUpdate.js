
const Event = require('../../structures/Handler/Event');

module.exports = class presenceUpdate extends Event {
    constructor() {
        super({
            name: 'presenceUpdate',
        });
    }

    async run(client, oldMember, newMember) {
        if (!oldMember || !newMember || !newMember.user) return;
        client.guilds.cache.forEach(guild => {

            const guildData = client.getGuildData(guild.id);
            const msg = guildData.config.soutienMsg
            const roleId = guildData.config.soutienId
            const role = guild.roles.cache.get(roleId)
            if (!role) return;
            const isOn = guildData.config.soutienOn;
            if (!newMember.user.presence) return;
            let status = newMember.user.presence.activities.map(a => a.state)
            if (guild.members.cache.get(newMember.user.id) === undefined) return;

            if (!isOn) {
                return;

            } else if (oldMember === undefined || newMember === undefined) {
                return;
            } else if (oldMember.status !== newMember.status || oldMember == undefined || newMember == undefined) {
                return;
            } else if (isOn ) {
                if (status[0] != null && status[0].includes(msg)) {
                    guild.members.cache.get(newMember.user.id).roles.add(roleId)
                } else {
                    if (guild.members.cache.get(newMember.user.id) === undefined) return;
                    if (guild.members.cache.get(newMember.user.id).roles.cache.some((r) => r.id === roleId)) {
                        guild.members.cache.get(newMember.user.id).roles.remove(roleId)
                    }
                }
            }
        });
    }
}
