const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'counter',
            description: "Show the counter creation menu | Afficher le menu de création d'un compteur",
            // Optionnals :
            usage: 'counter',
            category: 'misc',
            aliases: ['compteur'],
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        let memberCount = new Map();
        let botCount = new Map();
        let voiceCount = new Map();
        let onlineCount = new Map();
        let offlineCount = new Map();
        let channelCount = new Map();
        let roleCount = new Map();
        let boosterCount = new Map();
        const color = guildData.color;
        const lang = client.lang(guildData.lang)
        const msg = await message.reply(lang.loading)
        const emoji = ['👥', '🤖', '🔊', '🟢', '⭕', '📖', '✨', '💠', '❌', '✅']
        for (const em of emoji) {
            await msg.react(em)
        }

        memberCount.set(message.guild.id, guildData.config.memberCount)
        botCount.set(message.guild.id, guildData.config.botCount)
        voiceCount.set(message.guild.id, guildData.config.voiceCount)
        onlineCount.set(message.guild.id, guildData.config.onlineCount)
        offlineCount.set(message.guild.id, guildData.config.offlineCount)
        channelCount.set(message.guild.id, guildData.config.channelCount)
        roleCount.set(message.guild.id, guildData.config.roleCount)
        boosterCount.set(message.guild.id, guildData.config.boosterCount)
        const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const embed = new Embed(client, guildData)
            .setTitle(lang.counter.embedTitle)
            .setDescription(lang.counter.embedDescription(memberCount.get(message.guild.id).name, botCount.get(message.guild.id).name, voiceCount.get(message.guild.id).name, onlineCount.get(message.guild.id).name, offlineCount.get(message.guild.id).name, channelCount.get(message.guild.id).name, roleCount.get(message.guild.id).name, boosterCount.get(message.guild.id).name))
            .setFooter({ text: client.user.username })
        msg.edit({ embeds: [embed] }).then(async m => {
            const collector = m.createReactionCollector({ filter: filter, time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === emoji[0]) {
                    message.reply(lang.counter.memberChQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.reply(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.reply(lang.counter.disable("de membre")).then((e) => {
                                        memberCount.set(message.guild.id, {
                                            id: undefined,
                                            name: `Non définie`
                                        })
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== ChannelType.GuildVoice) await message.reply(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === ChannelType.GuildVoice) {

                                    const replyMsg = message.reply(lang.counter.successMemberCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    // const memberInfo = {
                                    //     id: ch.id,
                                    //     name:
                                    // }

                                    message.reply(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages({ filter: dureefiltrer, 
                                            max: 1,
                                            time: 30000
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                memberCount.set(message.guild.id, {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                })
                                                const replayMsg = message.reply(lang.counter.successMemberName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[1]) {
                    message.reply(lang.counter.botChQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.reply(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.reply(lang.counter.disable("de bots")).then((e) => {
                                        botCount.set(message.guild.id, {
                                            id: undefined,
                                            name: `Non définie`
                                        });
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== ChannelType.GuildVoice) await message.reply(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === ChannelType.GuildVoice) {

                                    const replyMsg = message.reply(lang.counter.successBotCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.reply(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages({ filter: dureefiltrer, 
                                            max: 1,
                                            time: 30000
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                botCount.set(message.guild.id, {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                })
                                                const replayMsg = message.reply(lang.counter.successBotName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })


                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[2]) {
                    message.reply(lang.counter.vocalChQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.reply(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.reply(lang.counter.disable("de membre en vocal")).then((e) => {
                                        voiceCount.set(message.guild.id, {
                                            id: undefined,
                                            name: `Non définie`
                                        });
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== ChannelType.GuildVoice) await message.reply(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === ChannelType.GuildVoice) {

                                    const replyMsg = message.reply(lang.counter.successVocalCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.reply(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages({ filter: dureefiltrer, 
                                            max: 1,
                                            time: 30000
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                voiceCount.set(message.guild.id,{
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                })
                                                const replayMsg = message.reply(lang.counter.successVocalName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[3]) {
                    message.reply(lang.counter.onlineChQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.reply(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.reply(lang.counter.disable("de membre en ligne")).then((e) => {
                                        onlineCount.set(message.guild.id,{
                                            id: undefined,
                                            name: `Non définie`
                                        });
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== ChannelType.GuildVoice) await message.reply(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === ChannelType.GuildVoice) {

                                    const replyMsg = message.reply(lang.counter.successOnlineCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.reply(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages({ filter: dureefiltrer, 
                                            max: 1,
                                            time: 30000
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                onlineCount.set(message.guild.id, {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                })
                                                const replayMsg = message.reply(lang.counter.successOnlineName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[4]) {
                    message.reply(lang.counter.offlineChQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.reply(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.reply(lang.counter.disable("de membre hors-ligne")).then((e) => {
                                        offlineCount.set(message.guild.id,{
                                            id: undefined,
                                            name: `Non définie`
                                        });
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== ChannelType.GuildVoice) await message.reply(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === ChannelType.GuildVoice) {

                                    const replyMsg = message.reply(lang.counter.successOfflineCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.reply(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages({ filter: dureefiltrer, 
                                            max: 1,
                                            time: 30000
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                offlineCount.set(message.guild.id,{
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                })
                                                const replayMsg = message.reply(lang.counter.successOfflineName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[5]) {
                    message.reply(lang.counter.channelChQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.reply(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.reply(lang.counter.disable("de salons")).then((e) => {
                                        channelCount.set(message.guild.id, {
                                            id: undefined,
                                            name: `Non définie`
                                        });
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== ChannelType.GuildVoice) await message.reply(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }

                                if (msg.content !== "off" && ch.type === ChannelType.GuildVoice) {

                                    const replyMsg = message.reply(lang.counter.successChannelCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.reply(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages({ filter: dureefiltrer, 
                                            max: 1,
                                            time: 30000
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                channelCount.set(message.guild.id, {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                })
                                                const replayMsg = message.reply(lang.counter.successChannelName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })


                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[6]) {
                    message.reply(lang.counter.roleChQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.reply(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.reply(lang.counter.disable("de rôles")).then((e) => {
                                        roleCount.set(message.guild.id, {
                                            id: undefined,
                                            name: `Non définie`
                                        });
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== ChannelType.GuildVoice) await message.reply(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === ChannelType.GuildVoice) {

                                    const replyMsg = message.reply(lang.counter.successRoleCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.reply(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages({ filter: dureefiltrer, 
                                            max: 1,
                                            time: 30000
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                roleCount.set(message.guild.id, {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                })
                                                const replayMsg = message.reply(lang.counter.successRoleName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[7]) {
                    message.reply(lang.counter.boostChQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.reply(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.reply(lang.counter.disable("de booster")).then((e) => {
                                        boosterCount.set(message.guild.id, {
                                            id: undefined,
                                            name: `Non définie`
                                        });
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== ChannelType.GuildVoice) await message.reply(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === ChannelType.GuildVoice) {

                                    const replyMsg = message.reply(lang.counter.successBoostCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.reply(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages({ filter: dureefiltrer, 
                                            max: 1,
                                            time: 30000
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                boosterCount.set(message.guild.id,{
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                })
                                                const replayMsg = message.reply(lang.counter.successBoostName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })


                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[8]) {
                    message.reply(lang.setlogs.cancel).then((mp) => {
                        memberCount.delete(message.guild.id);
                        botCount.delete(message.guild.id);
                        onlineCount.delete(message.guild.id);
                        offlineCount.delete(message.guild.id);
                        channelCount.delete(message.guild.id);
                        roleCount.delete(message.guild.id);
                        boosterCount.delete(message.guild.id);
                        collector.stop();
                        setTimeout(async () => {
                            mp.delete()
                        }, 2000)
                        return msg.delete();

                    })
                }
                if (r.emoji.name === emoji[9]) {
                    message.reply(lang.setlogs.save).then(async (mp) => {

                        await guildData.updateCounter(memberCount.get(message.guild.id), botCount.get(message.guild.id), voiceCount.get(message.guild.id), onlineCount.get(message.guild.id), offlineCount.get(message.guild.id), channelCount.get(message.guild.id), roleCount.get(message.guild.id), boosterCount.get(message.guild.id))

                        collector.stop();
                        setTimeout(async () => {
                            mp.delete()
                        }, 2000)
                        const memberChInfo = memberCount.get(message.guild.id)
                        const botChInfo = botCount.get(message.guild.id)
                        const voiceChInfo = voiceCount.get(message.guild.id)
                        const onlineChInfo = onlineCount.get(message.guild.id)
                        const offlineChInfo = offlineCount.get(message.guild.id)
                        const channelChInfo = channelCount.get(message.guild.id)
                        const roleChInfo = roleCount.get(message.guild.id)
                        const boostChInfo = boosterCount.get(message.guild.id)
                        await message.guild.members.fetch();
                        if (memberChInfo.id) {
                            const memberCh = message.guild.channels.cache.get(memberChInfo.id)
                            memberCh.setName(`${memberChInfo.name} ${message.guild.memberCount}`, 'MemberCount').then(() => {
                                memberCount.delete(message.guild.id);
                            })
                        }
                        if (botChInfo.id) {
                            const botCh = message.guild.channels.cache.get(botChInfo.id)
                            botCh.setName(`${botChInfo.name} ${message.guild.members.cache.filter(m => m.user.bot).size}`, 'BotCount').then(() => {
                                botCount.delete(message.guild.id);
                            })
                        }
                        if (voiceChInfo.id ) {
                            let count = 0;

                            const voiceChannels = message.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
                            for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
                            const voiceCh = message.guild.channels.cache.get(voiceChInfo.id)
                            voiceCh.setName(`${voiceChInfo.name} ${count}`, 'VoiceCount').then(() => {
                                voiceCount.delete(message.guild.id);
                            })
                        }
                        if (onlineChInfo.id) {
                            const onlineCh = message.guild.channels.cache.get(onlineChInfo.id)
                            onlineCh.setName(`${onlineChInfo.name} ${message.guild.members.cache.filter(member => member.presence?.status == "dnd" || member.presence?.status == "idle" || member.presence?.status == "online").size}`, 'OnlineCount').then(() => {
                                onlineCount.delete(message.guild.id);
                            })
                        }
                        if (offlineChInfo.id) {
                            const offlineCh = message.guild.channels.cache.get(offlineChInfo.id)
                            offlineCh.setName(`${offlineChInfo.name} ${message.guild.members.cache.filter(member => member.presence?.status == "offline").size}`, 'OfflineCount').then(() => {
                                offlineCount.delete(message.guild.id);
                            })
                        }
                        if (channelChInfo.id) {
                            const channelCh = message.guild.channels.cache.get(channelChInfo.id)
                            channelCh.setName(`${channelChInfo.name} ${message.guild.channels.cache.size}`, 'ChannelCount').then(() => {
                                channelCount.delete(message.guild.id);
                            })
                        }
                        if (roleChInfo.id) {
                            const roleCh = message.guild.channels.cache.get(roleChInfo.id)
                            roleCh.setName(`${roleChInfo.name} ${message.guild.roles.cache.size}`, 'RoleCount').then(() => {
                                roleCount.delete(message.guild.id);
                            })
                        }
                        if (boostChInfo.id) {
                            const boostCh = message.guild.channels.cache.get(boostChInfo.id)
                            boostCh.setName(`${boostChInfo.name} ${message.guild.premiumSubscriptionCount || '0'}`, 'BoosterCount').then(() => {
                                boosterCount.delete(message.guild.id);
                            })
                        }



                        return msg.delete();

                    })
                }

                function updateEmbed() {
                    embed.setDescription(lang.counter.embedDescription(memberCount.get(message.guild.id).name, botCount.get(message.guild.id).name, voiceCount.get(message.guild.id).name, onlineCount.get(message.guild.id).name, offlineCount.get(message.guild.id).name, channelCount.get(message.guild.id).name, roleCount.get(message.guild.id).name, boosterCount.get(message.guild.id).name))
                    msg.edit({ embeds: [embed] })


                }
            })
        })
    }
};

