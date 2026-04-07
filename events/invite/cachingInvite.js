const Event = require('../../structures/Handler/Event');


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'inviteFetched',
        });
    }

    async run(client, guildID, userId, invite) {
        console.log("Starting caching  invite")
        const guild = client.guilds.cache.get(guildID);
        if(!guild) return;
        const member = guild.members.cache.get(userId) || await guild.members.fetch(userId);
        if(!member) return;
        client.getMemberData(guild.id, member.id).updateInvite = invite;
        console.log(`GUILD : ${guild.name} ${member.user.username} - Fetched invite`)

    }
}
