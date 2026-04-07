const { EmbedBuilder } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'owner',
            description: 'Manage the owner of the server | Gérer les owner du serveur',
            usage: 'owner <add/ remove /list> < mention / id >',
            tags: ['guildOnly'],
            category: 'owners',
            guildCrownOnly: true,
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const lang = client.lang(guildData.lang)
        const color = guildData.color
        const add = args[0] === "add";
        const remove = args[0] === 'remove';
        const clear = args[0] === 'clear';
        const list = args[0] === 'list';
        if (!add && !remove && !list && !clear) return message.channel.send(lang.owner.errorSyntax)

        let owners = guildData.owners;
        while (owners[0] === '') {
            owners.shift()
        }

        if (add) {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[1]);
            if (!member) return message.channel.send(lang.owner.noMember)
            if (owners.includes(member.id)) return message.channel.send(lang.owner.errorAlreadyOwner(member.user.username))
            owners.push(member.id);
            guildData.updateOwner = owners;
            await message.channel.send(lang.owner.successOwner(member.user.username));

        } else if (remove) {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[1]);
            if (!member) return message.channel.send(lang.owner.noMember)
            if (!owners.includes(member.id)) return message.channel.send(lang.owner.errorNotOwner(member.user.username))
            owners = owners.filter(ow => ow !== member.id)
            guildData.updateOwner = owners;
            await message.channel.send(lang.owner.successRmOwner(member.user.username));

        } else if (list) {
            try {
                let tdata = await message.channel.send(lang.loading)

                let p0 = 0;
                let p1 = 10;
                let page = 1;


                let embed = new EmbedBuilder()

                embed.setTitle(lang.owner.titleList)
                    .setColor(`${color}`)
                    .setDescription(owners
                        .filter(x => message.guild.members.cache.get(x))
                        .map(r => r)
                        .map((user, i) => `${i + 1} ・ **<@${message.guild.members.cache.get(user).user.id}>**`)
                        .slice(0, 10)
                        .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(owners.length / 10)}**`)
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username}` });

                let reac1
                let reac2
                let reac3

                if (owners.length > 10) {
                    reac1 = await tdata.react("⬅");
                    reac2 = await tdata.react("❌");
                    reac3 = await tdata.react("➡");
                }

                tdata.edit({ embeds: [embed] });

                const data_res = tdata.createReactionCollector({ filter: (reaction, user) => user.id === message.author.id, time: 120000 });

                data_res.on("collect", async (reaction) => {
                    // r.users.remove(message.author);

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


                        embed.setDescription(owners
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} ・  **<@${message.guild.members.cache.get(user).user.id}>**`)
                            .slice(p0, p1)
                            .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(owners.length / 10)}**`)
                        tdata.edit({ embeds: [embed] });

                    }

                    if (reaction.emoji.name === "➡") {

                        p0 = p0 + 10;
                        p1 = p1 + 10;

                        page++;

                        if (p1 > owners.length + 10) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }


                        embed.setDescription(owners
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} ・  **<@${message.guild.members.cache.get(user).user.id}>**`)
                            .slice(p0, p1)
                            .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(owners.length / 10)}**`)
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
        } else if (clear) {


            const embed = new EmbedBuilder()
                .setTitle(`Confirmation`)
                .setDescription(lang.owner.clearOwner)
                .setFooter({ text: client.user.username })
                .setTimestamp()
                .setColor(`${color}`)
            const msg = await message.channel.send({ embeds: [embed] })
            await msg.react('✅')
            await msg.react('❌')

            const filter = (reaction, user) => ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            const collector = msg.createReactionCollector({ filter: filter, time: 30000});
            collector.on('collect', async (r, user) => {
                if (r.emoji.name === '✅') {
                    try {
                        owners = []
                        guildData.updateOwner = owners;
                        msg.delete()
                        return message.channel.send(lang.owner.successClearOwner)

                    } catch (err) {
                        console.error(err)
                        return message.channel.send(lang.owner.error)
                    }
                } else if (r.emoji.name === '❌') {
                    return message.channel.send(lang.owner.cancel)
                }
            })

        }
    }
}
