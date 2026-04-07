const { ChannelType } = require('discord.js');

// TODO : FIX BOOST
module.exports = class coins {
    constructor(client) {

        this.client = client

    }

    async loadVoice(){
        let status = "default"
        let loadedVoice = 0;
        this.client.channels.cache.filter(channel => {
            const gd = this.client.getGuildData(channel.guild.id);
            return gd.config && gd.config.coinsOn && channel.type === ChannelType.GuildVoice && channel.members.filter(m => !m.user.bot).size > 0;
        }).forEach(channel => {

            for (const [, member] of channel.members){
                if(member.voice.mute || member.voice.deaf){
                    status = "mute";
                }else if(member.voice.streaming || member.voice.selfVideo){
                    status = "stream"
                }

                if(this.client.getGuildData(channel.guild.id).coinsFarmer.has(member.id)) return;

                this.client.getGuildData(channel.guild.id).coinsFarmer.set(member.id, {
                    status,
                    boost : this.client.getGuildData(channel.guild.id).boost[status]
                })
                loadedVoice++
            }
        })
        console.log(`Loaded voice: ${loadedVoice}`);
    }
    async farmCoins(ms){
        setInterval(async () => {
            const guildWithFarmers = this.client.guilds.cache.filter(guild => { const gd = this.client.getGuildData(guild.id); return gd?.config?.coinsOn && gd.coinsFarmer.size > 0; });
            for await(const [, guild] of guildWithFarmers){
                const guildData = this.client.getGuildData(guild.id);
                for await (const [id, status] of guildData.coinsFarmer){
                    const member = guild.members.cache.get(id);
                    let memberCoins = this.client.getMemberData(guild.id, id).coins;
                    if(memberCoins === null) return;
                    memberCoins+=status.boost;
                    this.client.getMemberData(guild.id, id).updateCoins = memberCoins;
                }
            }
        }, ms)
    }

    async init(){
        await this.loadVoice();
        await this.farmCoins(60000)
    }
}
