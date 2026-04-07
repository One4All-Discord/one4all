const { ChannelType } = require('discord.js');
const Event = require('../../structures/Handler/Event');


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
        });
    }

    async run(client, oldState, newState) {

        if(!client.getGuildData(oldState.guild.id).config) return
        if(newState.id === client.user.id && newState.guild.members.me.voice?.channel) {
            try { await newState.guild.members.me.voice.setDeaf(true); } catch(e) {}
        }
        if (newState.member.user.bot) return;
        if (newState.channelId !== null) {
            let status = "default";
            if(!oldState.mute && newState.mute || !oldState.deaf && newState.deaf){
                status = "mute";
            }else if(!oldState.streaming && newState.streaming || !oldState.selfVideo && newState.selfVideo){
                status = "stream"
            }

            client.getGuildData(newState.guild.id).coinsFarmer.set(newState.id, {
                status,
                boost: newState.guild.boost[status]
            })
        } else {

            if (client.getGuildData(newState.guild.id).coinsFarmer.has(oldState.id)) client.getGuildData(newState.guild.id).coinsFarmer.delete(oldState.id)

            console.log(`${oldState.id || newState.id} - Player leaved`)
        }
    }
}
