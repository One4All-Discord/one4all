const Event = require('../../structures/Handler/Event');


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'coinsFetched',
        });
    }

    async run(client, guildID, userId, coins) {
        console.log("Starting caching coins")

        const guild = client.guilds.cache.get(guildID);
        if(!guild) return;
        const member = guild.members.cache.get(userId) || await guild.members.fetch(userId);
        if(!member) return;
        client.getMemberData(guild.id, member.id).updateCoins = coins;
        console.log(`GUILD : ${guild.name} ${member.user.username} - Fetched coins`)
        guild.coinsFetched = true;
    }
}
