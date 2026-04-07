const Event = require('../../structures/Handler/Event');
const moment = require('moment')
// TODO vanity custom

module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
        });
    }

    async run(client, member) {
        const guild = member.guild;
        const guildData = client.getGuildData(guild.id);
        const {inviteMessage, inviteChannel, inviteOn} = guildData.config;

        if (!inviteOn || !inviteMessage || !inviteChannel) return;
        const channel = guild.channels.cache.get(inviteChannel);
        const lang = client.lang(guild.lang);
        const cachedInv = guildData.cachedInv;
        const newInv = await guild.invites.fetch()
        const usedInv = newInv.find(inv => cachedInv.get(inv.code) ? cachedInv.get(inv.code).uses < inv.uses : undefined);
        for (const [code, invite] of newInv) {
            guildData.cachedInv.set(code, invite)
        }
        let finalMsg;
        if (!usedInv) {
            if (guild.vanityURLCode) {
                finalMsg = lang.invite.vanity(member)
            } else if (member.user.bot) {
                finalMsg = lang.invite.oauth(member)
            } else {
                finalMsg = lang.invite.cantTrace(member)
            }
        } else {
            const fake = (Date.now() - member.createdAt) / (1000 * 60 * 60 * 24) <= 3;
            let inviter = guild.members.cache.get(usedInv.inviter.id);
            if (inviter) {
                let count = client.getMemberData(guild.id, inviter.id).invite;
                count.join += 1;
                if (fake) count.fake += 1;
                client.getMemberData(guild.id, inviter.id).updateInvite = count
                client.getMemberData(guild.id, member.id).invitedBy = inviter.id;
                let space = "\n"
                let join = `${count.join}`;
                let memberTotal = `${guild.memberCount}`

                finalMsg = inviteMessage.replace("${invitedMention}", member).replace("${inviterTag}", inviter.user.username).replace("${count}", join).replace("${memberTotal}", memberTotal).replace("${invitedTag}", member.user.username).replace("${inviterMention}", inviter).replace("${fake}", count.fake).replace("${leave}", count.leave).replace("${creation}", moment(member.user.createdAt).format("DD/MM/YYYY"));
                while (finalMsg.includes("${space}")) {
                    finalMsg.replace("${space}", space)
                }


            }
        }
        if (channel) channel.send(finalMsg);


    }
}
