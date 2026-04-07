const { EmbedBuilder } = require('discord.js');
const StateManager = require('../../utils/StateManager');
const prettyMilliseconds = require('pretty-ms');
const Command = require('../../structures/Handler/Command');

module.exports = class UserStat extends Command {
    constructor() {
        super({
            name: 'stat',
            description: "Show the stats of a member | Afficher les statistiques d'un membre",
            usage: 'stat [mention/id]',
            category: 'stats',
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const color = guildData.color;
        this.connection = StateManager.connection;
        const lang = client.lang(guildData.lang);
        let member = message.mentions.members.first();
        if (member === undefined && args[0]) {
            if (message.guild.members.cache.has(args[0])) {
                member = message.guild.members.cache.get(args[0]);
            } else {
                member = await message.guild.members.fetch(args[0]).catch(() => {});
            }
        } else {
            member = message.member;
        }
        if (member === undefined) return message.channel.send(lang.stats.memberNotFound).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        let totalDuration = 0;
        let mostActiveChannel;
        let mostActiveChannelDuration = 0;
        await this.connection.query(`SELECT * FROM statsVoc WHERE userId = '${member.user.id}' AND guildId = '${message.guild.id}'`).then(async (res) => {
            if (res[0].length === 0) return message.channel.send(lang.stats.noStatsFound).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
            const voiceStats = res[0];
            voiceStats.forEach(async stats => {
                totalDuration += stats.duration;
                if (message.guild.channels.cache.get(stats.channelId) === undefined) {
                    await this.connection.query(`DELETE FROM statsVoc WHERE channelId = ${stats.channelId}`);
                }
            });
            let max = voiceStats.sort((a, b) => a.duration - b.duration)[voiceStats.length - 1];
            mostActiveChannelDuration = max.duration;
            mostActiveChannel = message.guild.channels.cache.get(max.channelId);
            if (mostActiveChannel === undefined) {
                await this.connection.query(`DELETE FROM statsVoc WHERE channelId = ${max.channelId}`);
            }
        });
        if (totalDuration !== 0) {
            const embed = new EmbedBuilder()
                .setDescription(lang.stats.desc(member))
                .addFields({ name: lang.stats.totalVoiceChat, value: prettyMilliseconds(totalDuration), inline: true })
                .addFields({ name: lang.stats.voiceMostActive, value: mostActiveChannel === undefined ? lang.stats.noVoiceChannel : `**${mostActiveChannel.name}**  __${prettyMilliseconds(mostActiveChannelDuration)}__`, inline: true })
                .setColor(`${color}`)
                .setFooter({ text: client.user.username, iconURL: member.user.displayAvatarURL() });
            message.channel.send({ embeds: [embed] });
        }
    }
};
