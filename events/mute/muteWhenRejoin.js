const Event = require('../../structures/Handler/Event');

module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
        });
    }

    async run(client, member) {
        const guild = member.guild;
        const guildData = client.getGuildData(guild.id);
        const { muted } = guildData;
        if (!guildData.config) return;
        const { muteRoleId } = guildData.config;
        if(muted.has(member.id)){
            const role = guild.roles.cache.get(muteRoleId);
            if(role){
                await member.roles.add(role, `Mute when leave the serveur`)
            }
        }

    }
}
