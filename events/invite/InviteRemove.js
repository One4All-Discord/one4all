const Event = require('../../structures/Handler/Event');


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildMemberRemove',
        });
    }
    async run(client, member){
        const { guild } = member
        const guildData = client.getGuildData(guild.id);
        const newInv = await guild.invites.fetch()
        for(const [code, invite] of newInv){
            guildData.cachedInv.set(code, invite)
        }
        if(!client.getMemberData(guild.id, member.id).inviter || member.user.bot) return;
        const invitedBy = member.guild.members.cache.get(client.getMemberData(guild.id, member.id).inviter)
        if(!invitedBy) return;
        let count = client.getMemberData(guild.id, invitedBy.id).invite;
        count.leave += 1
        client.getMemberData(guild.id, invitedBy.id).updateInvite = count;



    }
}
