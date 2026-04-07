const prettyMilliseconds = require('pretty-ms');
const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const moment = require('moment')
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'mutelist',
            description: 'Show the tempmute member of the server | Afficher la liste des membres tempmute du serveur',
            // Optionnals :
            usage: 'mutelist',
            category: 'moderation',
            userPermissions: [PermissionFlagsBits.MuteMembers],
            clientPermissions: [PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.getGuildData(message.guild.id);
        const mutedData = [];
        const color = guildData.color
        const lang = client.lang(guildData.lang)

        let now = Date.now();
        const {muted} = guildData;


        if (muted.size !== 0) {
           for (const [id, expireAt] of muted) {
               let timeLeft = expireAt
                if(expireAt !== "lifetime"){
                    timeLeft = prettyMilliseconds(expireAt.getTime() - now)
                }
               mutedData.push(`<@${id}> ・ ${timeLeft}`)
           }
        } else {
            mutedData.push('No data')
        }

        try {
            let tdata = await message.channel.send(lang.loading)

            let p0 = 0;
            let p1 = 10;
            let page = 1;

            let embed = new EmbedBuilder()
            embed.setTitle(`${lang.mutelist.title}`)
                .setColor(`${color}`)
                .setDescription(mutedData
                    .slice(0, 10)
                    .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
                .setTimestamp()
                .setFooter({ text: `${client.user.username}` });

            let reac1
            let reac2
            let reac3

            if (mutedData.length > 10) {
                reac1 = await tdata.react("⬅");
                reac2 = await tdata.react("❌");
                reac3 = await tdata.react("➡");
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


                    embed.setDescription(mutedData
                        .slice(p0, p1)
                        .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
                    tdata.edit({ embeds: [embed] });

                }

                if (reaction.emoji.name === "➡") {

                    p0 = p0 + 10;
                    p1 = p1 + 10;

                    page++;

                    if (p1 > mutedData.length + 10) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed.setDescription(mutedData
                        .slice(p0, p1)
                        .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
                    tdata.edit({ embeds: [embed] });

                }

                if (reaction.emoji.name === "❌") {
                    data_res.stop()
                    await tdata.reactions.removeAll()
                    return tdata.delete();
                }

                await reaction.users.remove(message.author.id);

            })

        } catch (err) {
            console.log(err)
        }

    }

}
;


