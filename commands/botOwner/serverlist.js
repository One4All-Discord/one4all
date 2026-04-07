const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'serverlist',
            description: 'Show all the server of the bot | Affiche tout les serveurs du bot',
            category: 'botOwner',
            usage: 'serverlist [guildId]',
            clientPermissions : [PermissionFlagsBits.EmbedLinks],
            ownerOnly: true,
            cooldown: 5

        });
    }
    async run(client, message,args) {
        const guildData = client.getGuildData(message.guild.id);


        let tempName = [];
        const color = guildData.color
        const lang = client.lang(guildData.lang)
        let count = 0

        client.guilds.cache.forEach(guild => {
            tempName.push(`${count} ・${guild.name}・ **(${guild.id})** \`[${guild.memberCount}]\`\n`)
            count++
        })
        if (!args[0]) {
            try {
                let tdata = await message.channel.send(lang.loading)

                let p0 = 0;
                let p1 = 10;
                let page = 1;
                // console.log(tempName.map(r => r).map((user, i) => message.guild.members.cache.get(user).user.id, i))

                let embed = new EmbedBuilder()
                embed.setTitle(`${lang.serverlist.title}`)
                    .setColor(`${color}`)
                    .setDescription(tempName
                        .slice(0, 10)
                        .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(tempName.length / 10)}**`)
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username}` });

                let reac1
                let reac2
                let reac3

                if (tempName.length > 10) {
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


                        embed.setDescription(tempName
                            .slice(p0, p1)
                            .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(tempName.length / 10)}**`)
                        tdata.edit({ embeds: [embed] });

                    }

                    if (reaction.emoji.name === "➡") {

                        p0 = p0 + 10;
                        p1 = p1 + 10;

                        page++;

                        if (p1 > tempName.length + 10) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }


                        embed.setDescription(tempName
                            .slice(p0, p1)
                            .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(tempName.length / 10)}**`)
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
            message.channel.send(lang.serverlist.leave)
        }
        if (!isNaN(args[0])) {
            if (!client.guilds.cache.has(args[0])) return message.channel.send(lang.serverlist.errorNotServer)

            const guild = client.guilds.cache.get(args[0])
            guild.leave().then(() => {
                message.channel.send(lang.serverlist.success(guild.name))
            })
        }
    }
};

