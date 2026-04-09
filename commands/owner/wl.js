const Embed = require('../../structures/Embed');
const { EmbedBuilder } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'wl',
            description: 'Manage the whitelist | Gérer la whitelist',
            usage: 'wl <add / remove/ list> < mention / id >',
            category: 'owner',
            guildOwnerOnly: true,
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const lang = client.lang(guildData.lang)


        let whitelisted = guildData.whitelisted;
        while (whitelisted[0] === '') {
            whitelisted.shift()
        }

        const color = guildData.color
        const clear = args[0] === 'clear'

        const add = args[0] === "add";
        const remove = args[0] === 'remove';
        const list = args[0] === 'list';
        if (!add && !remove && !list && !clear) return message.reply(lang.wl.errorSyntaxAdd)
        if (add) {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[1]);
            if (!member) return message.reply(lang.wl.noMember)
            if (whitelisted.includes(member.id)) return message.reply(lang.wl.errorAlreadyWl(member.user.username))
            whitelisted.push(member.id);
            guildData.updateWhitelist = whitelisted;
            await message.reply(lang.wl.successWl(member.user.username));


        } else if (remove) {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[1]);
            if (!member) return message.reply(lang.owner.noMember)
            if (!whitelisted.includes(member.id)) return message.reply(lang.wl.errorNotWl(member.user.username))
            whitelisted = whitelisted.filter(wl => wl !== member.id)
            guildData.updateWhitelist = whitelisted;
            await message.reply(lang.wl.successRmWl(member.user.username));

        } else if (list) {

            try {
                let tdata = await message.reply(lang.loading)

                let p0 = 0;
                let p1 = 10;
                let page = 1;


                let embed = new Embed(client, guildData)

                embed.setTitle(`▫️ Liste des membres whitelist`)
                    .setDescription(whitelisted
                        .filter(x => message.guild.members.cache.get(x))
                        .map(r => r)
                        .map((user, i) => `${i + 1} ・ **<@${message.guild.members.cache.get(user).user.id}>**`)
                        .slice(0, 10)
                        .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(whitelisted.length / 10)}**`)
                    .setFooter({ text: `${client.user.username}` });

                let reac1
                let reac2
                let reac3

                if (whitelisted.length > 10) {
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


                        embed.setDescription(whitelisted
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} ・  **<@${message.guild.members.cache.get(user).user.id}>**`)
                            .slice(p0, p1)
                            .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(whitelisted.length / 10)}**`)
                        tdata.edit({ embeds: [embed] });

                    }

                    if (reaction.emoji.name === "➡") {

                        p0 = p0 + 10;
                        p1 = p1 + 10;

                        page++;

                        if (p1 > whitelisted.length + 10) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }


                        embed.setDescription(whitelisted
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} ・ **<@${message.guild.members.cache.get(user).user.id}>**`)
                            .slice(p0, p1)
                            .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(whitelisted.length / 10)}**`)
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
            const embed = new Embed(client, guildData)
                .setTitle(`Confirmation`)
                .setDescription(lang.whitelisted.clearWl)
                .setFooter({ text: client.user.username })
            const msg = await message.reply({ embeds: [embed] })
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
                        whitelisted = []
                        guildData.updateWhitelist = whitelisted;
                        msg.delete()
                        return message.reply(lang.wl.successClearWl)

                    } catch (err) {
                        console.error(err)
                        return message.reply(lang.wl.error)
                    }
                } else if (r.emoji.name === '❌') {
                    return message.reply(lang.wl.cancel)
                }
            })

        }
    }
}
