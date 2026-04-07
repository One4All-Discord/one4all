const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'warnlist',
            description: "Show the server warns or of a specif member | Affiche les warns du serveur ou d'un membre en particulier",
            category: 'warn',
            usage: 'warnlist [member/id]',
            aliases: ['warn-list', 'serverwarn'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            userPermissions: [PermissionFlagsBits.BanMembers],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const color = guildData.color
        const warnedMember = await message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
        const lang = client.lang(guildData.lang)
        if (warnedMember) {
            const warnsMember = client.getMemberData(message.guild.id, warnedMember.user.id || warnedMember.id).warns;
            const embed = new EmbedBuilder()
                .setTitle(`Warns de ${warnedMember.user.username}`)
                .setDescription(warnsMember.map((warn, i) => `${i + 1} - Raison : ${warn}\n`).join(''))
                .setTimestamp()
                .setColor(color)
                .setFooter({ text: client.user.username, iconURL: !warnsMember.user ? client.user.displayAvatarURL() : warnedMember.user.displayAvatarURL() })
            if(warnsMember.length < 1) embed.setDescription(lang.warn.noWarn)
            await message.channel.send({ embeds: [embed] })
        } else {
            const allWarns = await message.guild.allWarns()
            if (!allWarns) return message.channel.send(lang.warn.noGuildWarn)
            let tdata = await message.channel.send(lang.loading)

            let p0 = 0;
            let p1 = 10;
            let page = 1;


            let embed = new EmbedBuilder()

            embed.setTitle(`${message.guild.name} warns`)
                .setColor(color)
                .setDescription(allWarns
                    .map((info, i) => `${i + 1} ・ <@${info.userId}> : ${info.warn.slice(0, 8)}`)
                    .slice(0, 10)
                    .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(allWarns.length / 10)}**`)
                .setTimestamp()
                .setFooter({ text: `${client.user.username}` });


            if (allWarns.length > 10) {
                await tdata.react("⬅");
                await tdata.react("❌");
                await tdata.react("➡");
            }

            tdata.edit({ embeds: [embed] });

            const data_res = tdata.createReactionCollector({ filter: (reaction, user) => user.id === message.author.id, time: 120000 });

            data_res.on("collect", async (reaction) => {

                if (reaction.emoji.name === "⬅") {

                    p0 = p0 - 10;
                    p1 = p1 - 10;
                    page = page - 1

                    if (p0 < 0) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed.setDescription(allWarns
                        .map((info, i) => `${i + 1} ・ <@${info.userId}> : ${info.warn.slice(0, 8)}`)
                        .slice(p0, p1)
                        .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(allWarns.length / 10)}**`)
                    tdata.edit({ embeds: [embed] });

                }

                if (reaction.emoji.name === "➡") {

                    p0 = p0 + 10;
                    p1 = p1 + 10;

                    page++;

                    if (p1 > allWarns.length + 10) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed.setDescription(allWarns
                        .map((info, i) => `${i + 1} ・ <@${info.userId}> : ${info.warn.slice(0, 8)}`)
                        .slice(p0, p1)
                        .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(allWarns.length / 10)}**`)
                    tdata.edit({ embeds: [embed] });

                }

                if (reaction.emoji.name === "❌") {
                    data_res.stop()
                    await tdata.reactions.removeAll()
                    return tdata.delete();
                }

                await reaction.users.remove(message.author.id);

            })


        }


    }
}
