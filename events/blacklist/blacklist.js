const Event = require('../../structures/Handler/Event');
const ms = require("ms");
const moment = require("moment")

module.exports = class AntiBot extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
        });
    }

    async run(client, member) {
        if(member.user.id === client.user.id) return;
        const guild = member.guild;

        const color = guild.color;
        let {antiraidLog} = guild.logs;
        let {logs} = client.lang(guild.lang)
        const user = client.users.cache.get(guild.ownerId) || await client.users.fetch(guild.ownerId)
        const userData = client.getUserData(user);
        if(!userData.blacklist) return;
        const isOn = userData.blacklist.enable
        if (!isOn) return;
        let isBotOwner = client.isOwner(member.id);
        if(isBotOwner) return;
        const blacklist = userData.blacklist.blacklisted;
        if(!blacklist) return;
        if(blacklist.includes(member.id)){
            await guild.members.ban(member, {reason:`OneForAll - Type : Blacklist`})
            const channel = guild.channels.cache.get(antiraidLog)
            if(channel){
                channel.send(logs.blacklist(member, color, "ban"))
            }
        }


    }
}
