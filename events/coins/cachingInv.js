const Event = require('../../structures/Handler/Event');


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'inventoryFetched',
        });
    }

    async run(client, guildID, userId, inventory) {
        console.log("Starting caching  inventory")

        const guild = client.guilds.cache.get(guildID);
        if(!guild) return;
        const member = guild.members.cache.get(userId) || await guild.members.fetch(userId);
        if(!member) return;
        client.getMemberData(guild.id, member.id).updateInventory = inventory;
        console.log(`GUILD : ${guild.name} ${member.user.username} - Fetched inventory`)

    }
}
