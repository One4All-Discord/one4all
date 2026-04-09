const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'blacklist',
            description: 'Manage the blacklist of the server | Gérer la blacklist du serveur',
            // Optionnals :
            usage: 'blacklist <remove / add /list / on /off>',
            category: 'owners',
            aliases: ['bl'],
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.BanMembers],
            guildOwnerOnly: true,
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        let owner = message.guild.ownerId;

        const color = guildData.color
        const lang = client.lang(guildData.lang)
        let guildOwner = await client.users.cache.get(owner) || await client.users.fetch(owner, true)
        await client.getUserData(guildOwner).fetchBlacklistedUsers()
        let guildOwnerBlacklisted = client.getUserData(guildOwner).blacklist;
        let tempdata = !guildOwnerBlacklisted ? null : guildOwnerBlacklisted.blacklisted;

        const clear = args[0] === 'clear';
        const add = args[0] === "add";
        const remove = args[0] === 'remove';
        const list = args[0] === 'list';
        const on = args[0] === 'on';
        const off = args[0] === 'off';
        if (!add && !remove && !list && !clear && !on && !off) return message.reply(lang.blacklist.errorSyntax)

        if (on) {
            if (guildOwnerBlacklisted && guildOwnerBlacklisted.enable) return await message.reply(lang.blacklist.errorAlreadyOn)

            if (!guildOwnerBlacklisted) {
                await client.getUserData(guildOwner).initBlacklist(true).then(res => guildOwnerBlacklisted = res)
            }
            guildOwnerBlacklisted.enable = true
            client.getUserData(guildOwner).updateBlacklist(guildOwnerBlacklisted)
            tempdata = client.getUserData(guildOwner).blacklist.blacklisted;
            return message.reply(lang.blacklist.successEnable)
        }
        if (off) {
            if (guildOwnerBlacklisted && !guildOwnerBlacklisted.enable) return await message.reply(lang.blacklist.errorAlreadyOff)

            if (!guildOwnerBlacklisted) {
                await client.getUserData(guildOwner).initBlacklist(false).then(res => guildOwnerBlacklisted = res)
            }

            guildOwnerBlacklisted.enable = false

            client.getUserData(guildOwner).updateBlacklist(guildOwnerBlacklisted)
            tempdata = client.getUserData(guildOwner).blacklist.blacklisted;
            return message.reply(lang.blacklist.successDisable)

        }
        if (add) {
            let memberUser = message.mentions.users.first() || await client.users.fetch(args[1], true)
            if (!memberUser && !client.botperso) {
                if (client.shard) {
                    client.shard.broadcastEval(`this.users.cache.get('${args[1]}')`).then((res) => {
                        memberUser = res.filter(user => user !== null);
                    })
                }
            }
            if (!memberUser) return message.reply(lang.blacklist.errorCantFindMember)
            if (!args[1] && !message.mentions.members.first()) {
                return message.reply(lang.blacklist.errorSyntaxAdd)
            }

            if (client.isOwner(memberUser.id)) return message.reply(lang.blacklist.errorBotOwner)
            if (memberUser.id === owner) return message.reply(lang.blacklist.errorCrown)
            if (memberUser.id === client.user.id) return message.reply(lang.blacklist.errorMe)
            if (!memberUser) return message.reply(lang.blacklist.errorSyntaxAdd)
            let isTargetOwner = client.isOwner(message.guild.id, memberUser.id)
            if (isTargetOwner && message.author.id !== owner) return message.reply(lang.blacklist.errorTryBlOwner(memberUser))
            if (!tempdata) return message.reply(lang.blacklist.errorNotInDb(guildData.prefix))
            if (tempdata.includes(memberUser.id)) return message.reply(lang.blacklist.errorAlreadyBl(memberUser))
            while (tempdata[0] === '') {
                await tempdata.shift()
            }
            if (!tempdata.includes(memberUser.id)) {
                tempdata.push(memberUser.id);
            }

            const visualitor = {
                enable: guildOwnerBlacklisted.enable,
                blacklisted: tempdata
            }
            client.getUserData(guildOwner).updateBlacklist(visualitor).then(() => {
                message.reply(lang.blacklist.successBl(memberUser)).then(() => {
                    message.guild.members.ban(memberUser.id, {reason: `Blacklist par ${message.author.username}`,})
                        .then(() => {
                            message.reply(lang.blacklist.successBanBl(memberUser)).then(async () => {
                                try {
                                    if (client.botperso) {
                                        let guildCount = client.guilds.cache.filter(guild => guild.ownerId === owner && guild.id !== message.guild.id).size;
                                        await client.guilds.cache.filter(guild => guild.members.cache.has(owner) && guild.id !== message.guild.id).forEach(guild => {
                                            guild.members.ban(memberUser.id, {reason: `Blacklist par ${message.author.username}`,})

                                        })
                                        await message.reply(lang.blacklist.successBanGuild(guildCount))

                                    } else if (client.shard) {
                                        const guildCount = await client.shard.broadcastEval(`this.guilds.cache.filter(guild => guild.ownerId === '${owner}' && guild.id !== '${message.guild.id}').size`).then(async (res) => res.reduce((acc, guildCount) => acc + guildCount), 0)
                                        console.log(guildCount);
                                        const reason = `Blacklist par ${message.author.username}`
                                        await client.shard.broadcastEval(`
                                        (async () => {
                                            let guilds = this.guilds.cache.filter(guild => guild.ownerId === '${owner}' && guild.id !== '${message.guild.id}');
                                            guilds.forEach(guild => {
                                                guild.members.ban('${memberUser.id}', {reason: 'Blacklist'})
                                            })
                                        })();
                                    `).then(async (res) => {
                                            await message.reply(lang.blacklist.successBanGuild(guildCount))
                                        })
                                    }

                                } catch (e) {
                                    console.log(e)
                                }

                            })
                        })
                })

            })
        } else if (remove) {
            let memberUser = message.mentions.users.first() || await client.users.fetch(args[1], true)
            if (!memberUser && !client.botperso) {
                if (client.shard) {
                    client.shard.broadcastEval(`this.users.cache.get('${args[1]}')`).then((res) => {
                        memberUser = res.filter(user => user !== null);
                    })
                }
            }
            if (!memberUser) return message.reply(lang.blacklist.errorCantFindMember)
            if (!args[1] && !message.mentions.members.first()) {
                return message.reply(lang.blacklist.errorSyntaxAdd)
            }

            if (memberUser.id === owner && memberUser === message.guild.ownerId) return message.reply(lang.blacklist.errorCrown)
            if (memberUser.id === client.user.id) return message.reply(lang.blacklist.errorMe)
            if (!memberUser) return message.reply(lang.blacklist.errorSyntaxAdd)
            let isTargetOwner = client.isOwner(message.guild.id, memberUser.id)
            if (isTargetOwner && message.author.id !== owner) return message.reply(lang.blacklist.errorTryUnBlOwner(memberUser))
            if (!tempdata) return message.reply(lang.blacklist.errorNotInDb(guildData.prefix))

            if (!tempdata.includes(memberUser.id)) return message.reply(lang.blacklist.errorNotBl(memberUser))

            tempdata = tempdata.filter(x => x !== memberUser.id)

            const visualitor = {
                enable: guildOwnerBlacklisted.enable,
                blacklisted: tempdata
            }
            client.getUserData(guildOwner).updateBlacklist(visualitor).then(() => {

                message.reply(lang.blacklist.successRmBl(memberUser)).then(() => {
                    message.guild.members.unban(memberUser.id, `UnBlacklist par ${message.author.username}`)
                        .then(() => {
                            message.reply(lang.blacklist.successUnBanBl(memberUser)).then(async () => {
                                try {
                                    if (client.botperso) {
                                        let guildCount = client.guilds.cache.filter(guild => guild.ownerId === owner && guild.id !== message.guild.id).size;
                                        await client.guilds.cache.filter(guild => guild.members.cache.has(owner) && guild.id !== message.guild.id).forEach(guild => {
                                            guild.members.unban(memberUser.id, {reason: `UnBlacklist par ${message.author.username}`,})

                                        })
                                        await message.reply(lang.blacklist.successUnBanGuild(guildCount))

                                    } else if (client.shard) {
                                        const guildCount = await client.shard.broadcastEval(`this.guilds.cache.filter(guild => guild.ownerId === '${owner}' && guild.id !== '${message.guild.id}').size`).then(async (res) => res.reduce((acc, guildCount) => acc + guildCount), 0)
                                        console.log(guildCount);
                                        const reason = `Blacklist par ${message.author.username}`
                                        await client.shard.broadcastEval(`
                                        (async () => {
                                            let guilds = this.guilds.cache.filter(guild => guild.ownerId === '${owner}' && guild.id !== '${message.guild.id}');
                                            guilds.forEach(guild => {
                                                guild.members.unban('${memberUser.id}', {reason: 'UnBlacklist'})
                                            })
                                        })();
                                    `).then(async (res) => {
                                            await message.reply(lang.blacklist.successUnBanGuild(guildCount))

                                        })
                                    }

                                } catch (e) {
                                    console.log(e)
                                }

                            })
                        })
                })

            })
        } else if (list) {
            if (!tempdata) return message.reply(lang.blacklist.errorNotInDb(guildData.prefix))
            try {
                let tdata = await message.reply(lang.loading)

                let p0 = 0;
                let p1 = 10;
                let page = 1;
                const tempMember = []
                for (let ids of tempdata) {
                    let user;
                    if (client.botperso) {
                        if (!client.users.cache.has(ids)) {
                            user = await client.users.fetch(ids)

                        } else {
                            user = client.users.cache.get(ids)
                        }
                    } else {
                        user = client.users.cache.get(ids) || await client.users.fetch(ids, true).catch(err => {
                            if (err.httpStatus === 404) {
                                tempdata = tempdata.filter(x => x !== ids);
                                client.getUserData(guildOwner).blacklist.blacklisted = tempdata;
                                client.getUserData(guildOwner).updateBlacklist(client.getUserData(guildOwner).blacklist)
                            }
                        });
                        if (!user && client.shard) {
                            client.shard.broadcastEval(`this.users.cache.get('${ids}')`).then((res) => {
                                user = res.find(user => user !== null);
                            })
                        }

                    }
                    if (user) {
                        tempMember.push(user)

                    }

                }
                let embed = new Embed(client, guildData)
                embed.setTitle(lang.blacklist.titleList)
                embed.setDescription(tempMember
                    .map((user, i) => `${i + 1} ・ **${user.username}** \`${user.id}\``)
                    .slice(0, 10)
                    .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(tempdata.length / 10)}**`)
                    .setFooter({ text: `${client.user.username}` });

                let reac1
                let reac2
                let reac3

                if (tempdata.length > 10) {
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

                        embed.setDescription(tempMember
                            .map((user, i) => `${i + 1} ・ **${user.username}** \`${user.id}\``)
                            .slice(p0, p1)
                            .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(tempdata.length / 10)}**`)
                        tdata.edit({ embeds: [embed] });

                    }

                    if (reaction.emoji.name === "➡") {

                        p0 = p0 + 10;
                        p1 = p1 + 10;

                        page++;

                        if (p1 > tempdata.length + 10) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }

                        embed.setDescription(tempMember
                            .map((user, i) => `${i + 1} ・ **${user.username}** \`${user.id}\``)
                            .slice(p0, p1)
                            .join('\n') + `\n\n▫️ Page **${page}** / **${Math.ceil(tempdata.length / 10)}**`)
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
                .setDescription(lang.blacklist.clearBl)
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
                        tempdata = []

                        client.getUserData(guildOwner).blacklist.blacklisted = tempdata;
                        client.getUserData(guildOwner).updateBlacklist(client.getUserData(guildOwner).blacklist)
                        msg.delete()
                        return message.reply(lang.blacklist.successClearBl)

                    } catch (err) {
                        console.error(err)
                        return message.reply(lang.blacklist.errror)
                    }
                } else if (r.emoji.name === '❌') {
                    return message.reply(lang.blacklist.cancel)
                }
            })

        }

    }
}