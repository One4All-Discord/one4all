const { PermissionFlagsBits, ChannelType } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'vocal',
            description: 'Show how many members are in voice chat | Permet de montrer combien de membres sont en vocal',
            usage: 'vocal',
            category: 'everyone',
            aliases: ['voc', 'vc'],
            clientPermissions: [PermissionFlagsBits.SendMessages],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const voiceChannels = message.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
        const members = message.guild.members.cache.filter(m => !m.bot && m.voice.channelId != null);
        const color = guildData.color
        const lang = client.lang(guildData.lang)

        let count = 0;
        let muteCount = 0;
        let streamingCount = 0;
        let muteHeadSetCount = 0;
        let openMicCount = 0;
        for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
        for (const [id, member] of members) {
            if (member.voice.mute === true && member.voice.deaf === false) {
                muteCount += 1
            }
            if (member.voice.streaming === true) {
                streamingCount += 1
            }
            if (member.voice.deaf === true) {
                muteHeadSetCount += 1
            }
            if (member.voice.mute === false && member.voice.deaf === false) {
                openMicCount += 1
            }

        }
        message.reply(lang.vocal.msg(count, muteCount, streamingCount, muteHeadSetCount, openMicCount))
    }
};


