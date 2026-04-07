const { EmbedBuilder, PermissionFlagsBits, ChannelType, Util } = require('discord.js');

const chs = new Map();
const msgId = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'reactrole',
            description: "Show the react role menu création | Affiche le menu de création d'un reactrole",
            usage: 'reactrole',
            category: 'moderation',
            tags: ['guildOnly'],
            clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks],
            userPermissions: [PermissionFlagsBits.Administrator],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);


        const emojiRoleMapping = new Map();

        const lang = client.lang(guildData.lang)
        msgId.set(message.guild.id, 'Non définie')
        chs.set(message.guild.id, 'Non définie',)
        // isDelete.set(message.guild.id, false)

        const color = guildData.color
        const msg = await message.channel.send(lang.loading)
        await msg.react('📖')
        await msg.react('🆔')
        await msg.react('💠')
        await msg.react('🚫')
        await msg.react('📛')
        await msg.react('❌')
        await msg.react('✅')
        let embed = new EmbedBuilder()
            .setTitle(lang.reactionRole.embedTitle)
            .setDescription(lang.reactionRole.embedDescription(chs.get(message.guild.id), msgId.get(message.guild.id), ['Non définie']))
            .setFooter({ text: client.user.username })
            .setTimestamp()
            .setColor(`${color}`);

        const filter = (reaction, user) => ['📖', '🆔', '💠', '🚫', '📛', '❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };

        msg.edit({ embeds: [embed] }).then(async m => {
            const collector = m.createReactionCollector({ filter: filter, time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === '📖') {
                    await message.channel.send(lang.reactionRole.chQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 50000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() === "cancel") {
                                    const reply = await message.channel.send(lang.cancel)
                                    await setTimeout(() => reply.delete().catch(() => {}), 2000)
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'cancel') {
                                    const replyMsg = await message.channel.send(lang.counter.errorNotChannel);
                                    await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== "cancel") {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== "cancel") ch = msg.mentions.channels.first();
                                if (ch.type !== ChannelType.GuildText) await message.channel.send(lang.reactionRole.notText).then((e) => {
                                    return setTimeout(() => e.delete().catch(() => {}), 2000)
                                })
                                if (msg.content !== "cancel" && ch.type === ChannelType.GuildText) {

                                    const replyMsg = message.channel.send(lang.reactionRole.successCh(ch)).then((replyMSG) => {
                                        chs.set(message.guild.id, ch.id)

                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)
                                        updateEmbed()


                                    })
                                }
                            });
                    })
                } else if (r.emoji.name === '🆔') {
                    await message.channel.send(lang.reactionRole.msgIdQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 50000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() === 'cancel') return message.channel.send(lang.cancel)

                                let msgIdF
                                if (isNaN(msg.content)) return message.channel.send(lang.reactionRole.notId).then(rp => setTimeout(() => {
                                    rp.delete()
                                    msg.delete()
                                    mp.delete()
                                }, 2000))
                                // console.log(typeof chs.get(message.guild.id == null))
                                if (chs.get(message.guild.id === 'Non définie')) return message.channel.send(lang.reactionRole.noChannel).then(rp => setTimeout(() => {
                                    rp.delete()
                                    msg.delete()
                                    mp.delete()
                                }, 2000))

                                try {
                                    msgIdF = await message.guild.channels.cache.get(chs.get(message.guild.id)).messages.fetch(msg.content)

                                } catch (err) {
                                    return await message.channel.send(lang.reactionRole.noChannel).then(rp => setTimeout(() => {
                                        rp.delete()
                                        msg.delete()
                                        mp.delete()
                                    }, 2000))

                                }

                                setTimeout(async () => {
                                    await mp.delete();
                                    await msg.delete();
                                }, 2000)
                                if (guildData.reactRoles.has(msgIdF.id)) {
                                    return await message.channel.send(lang.reactionRole.alreadyReact).then(rp => setTimeout(() => {
                                        rp.delete()
                                        msg.delete()
                                        mp.delete()
                                    }, 2000))
                                }
                                await msgId.set(message.guild.id, msgIdF.id);
                                await updateEmbed();


                            });
                    })
                } else if (r.emoji.name === '💠') {

                    await message.channel.send(lang.reactionRole.roleQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 50000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() === "cancel") {
                                    const reply = await message.channel.send(lang.cancel)
                                    await setTimeout(() => reply.delete().catch(() => {}), 2000)
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                if (!msg.mentions.roles.first() && isNaN(msg.content) && msg.content != 'cancel') {
                                    const replyMsg = await message.channel.send(lang.reactionRole.noRole);
                                    await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                let role;

                                if (!isNaN(msg.content) && msg.content !== "cancel") {
                                    try {
                                        role = message.guild.roles.cache.get(msg.content)
                                        if (role.managed) {
                                            const replyMsg = await message.channel.send(lang.reactionRole.managedRole);
                                            await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                            await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                            return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                        }
                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.roles.first() && msg.content !== "cancel") role = msg.mentions.roles.first();
                                for (const [key, value] of emojiRoleMapping) {
                                    if (value === role.id) {
                                        const replyMsg = await message.channel.send(lang.reactionRole.roleAlready);
                                        await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                        await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                        return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                    }

                                }

                                await message.channel.send(lang.reactionRole.emojiQ).then(async mps => {
                                    mps.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 50000})
                                        .then(async cld => {
                                            let msg = cld.first();
                                            // console.log(msg)
                                            let emoji = Util.parseEmoji(msg.content);
                                            if (emoji.id == null) {
                                                if (emojiRoleMapping.has(emoji.name)) {
                                                    const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                    await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                                }
                                                emojiRoleMapping.set(emoji.name, role.id)
                                                updateEmbed()
                                                setTimeout(async () => {
                                                    await msg.delete()
                                                    mp.delete()
                                                    mps.delete()
                                                }, 2000)

                                            }
                                            if (emoji.id != null) {
                                                let emojis;
                                                if (client.botperso) {
                                                    emojis = client.emojis.cache.get(emoji.id)

                                                } else {
                                                    if (client.shard) {
                                                        await client.shard.broadcastEval(`this.emojis.cache.get('${emoji.id}')`).then((result) => {
                                                            emojis = result.filter(em => em !== null)[0]
                                                        })
                                                    }
                                                }
                                                if (emojis === undefined) {
                                                    await message.channel.send(lang.reactionRole.emojiDoesNotExist).then(async mp => {
                                                        mp.channel.awaitMessages({ filter: dureefiltrer, 
                                                            max: 1,
                                                            time: 50000
                                                        })
                                                            .then(async cld => {
                                                                const name = cld.first().content;
                                                                // let custom = Util.parseEmoji(emoji);
                                                                let link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
                                                                message.guild.emojis.create(link, name, {reason: `emoji add par ${message.author.username}`}).then(async (em) => {
                                                                    message.channel.send(lang.addemoji.success(name))
                                                                    let emojis = message.guild.emojis.cache.get(em.id)
                                                                    if (emojiRoleMapping.has(emojis.id)) {
                                                                        const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                                        await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                                                        await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                                                        return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                                                    }
                                                                    emojiRoleMapping.set(emojis.id, role.id)
                                                                    console.log('no emoji', emojiRoleMapping)
                                                                    updateEmbed()
                                                                    setTimeout(async () => {
                                                                        msg.delete()
                                                                        mp.delete()
                                                                        mps.delete()
                                                                    }, 2000)
                                                                }).catch(err => {
                                                                    console.log(err)
                                                                    message.channel.send(lang.addemoji.error(name))

                                                                })

                                                            })
                                                    })

                                                } else {
                                                    if (emojiRoleMapping.has(emojis.id)) {
                                                        const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                        await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                                        await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                                        return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                                    }
                                                    emojiRoleMapping.set(emojis.id, role.id)
                                                    updateEmbed()
                                                    setTimeout(async () => {
                                                        msg.delete()
                                                        mp.delete()
                                                        mps.delete()
                                                    }, 2000)
                                                }

                                            }


                                        });
                                })
                            });
                    })

                } else if (r.emoji.name == '🚫') {
                    await message.channel.send(lang.reactionRole.roleDelQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 50000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (emojiRoleMapping.size == 0) {
                                    const reply = await message.channel.send(lang.reactionRole.noRole)
                                    await setTimeout(() => reply.delete().catch(() => {}), 2000)
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)

                                }
                                if (msg.content.toLowerCase() == "cancel") {
                                    const reply = await message.channel.send(lang.cancel)
                                    await setTimeout(() => reply.delete().catch(() => {}), 2000)
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                if (!msg.mentions.roles.first() && isNaN(msg.content) && msg.content != 'cancel') {
                                    const replyMsg = await message.channel.send(lang.reactionRole.noRole);
                                    await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                let role;

                                if (!isNaN(msg.content) && msg.content != "cancel") {
                                    try {
                                        role = message.guild.roles.cache.get(msg.content)
                                        if (role.managed) {
                                            const replyMsg = await message.channel.send(lang.reactionRole.managedRole);
                                            await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                            await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                            return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                        }
                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.roles.first() && msg.content !== "cancel") role = msg.mentions.roles.first();
                                for (const [key, value] of emojiRoleMapping) {
                                    if (value !== role.id) {
                                        const replyMsg = await message.channel.send(lang.reactionRole.roleNotFound);
                                        await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                        await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                        return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                    }
                                    if (value === role.id) {
                                        emojiRoleMapping.delete(key)
                                    }
                                }
                                updateEmbed()
                                setTimeout(async () => {
                                    await msg.delete();
                                    return await mp.delete();
                                }, 2000)
                            });
                    })
                } else if (r.emoji.name === '❌') {
                    message.channel.send(lang.reactionRole.cancel).then((mp) => {
                        msgId.delete(message.guild.id);
                        chs.delete(message.guild.id);
                        emojiRoleMapping.clear();
                        collector.stop('user_stop');
                        setTimeout(async () => {
                            mp.delete()
                        }, 2000)
                        return msg.delete();

                    })


                } else if (r.emoji.name === '📛') {
                    await message.channel.send(lang.reactionRole.chDeleteQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 50000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() === "cancel") {
                                    const reply = await message.channel.send(lang.cancel)
                                    await setTimeout(() => reply.delete().catch(() => {}), 2000)
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'cancel') {
                                    const replyMsg = await message.channel.send(lang.counter.errorNotChannel);
                                    await setTimeout(() => replyMsg.delete().catch(() => {}), 2000);
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== "cancel") {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== "cancel") ch = msg.mentions.channels.first();
                                if (ch.type !== ChannelType.GuildText) await message.channel.send(lang.reactionRole.notText).then((e) => {
                                    return setTimeout(() => e.delete().catch(() => {}), 2000)
                                })
                                if (msg.content !== "cancel" && ch.type === ChannelType.GuildText) {

                                    const replyMsg = message.channel.send(lang.reactionRole.successCh(ch)).then((replyMSG) => {


                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                }
                                await message.channel.send(lang.reactionRole.msgDeleteQ).then(mp => {
                                    mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 50000})
                                        .then(async cld => {
                                            let msg = cld.first();
                                            if (msg.content.toLowerCase() === "cancel") {
                                                const reply = await message.channel.send(lang.cancel)
                                                await setTimeout(() => reply.delete().catch(() => {}), 2000)
                                                await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                                return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                            }
                                            if (isNaN(msg.content) && msg.content !== 'cancel') {
                                                const reply = await message.channel.send(lang.reactionRole.invalid).then((replyMSG) => {
                                                    setTimeout(async () => {
                                                        await replyMSG.delete();
                                                        await mp.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                            } else if (msg.content !== 'cancel') {
                                                try {
                                                    let fetchedMsg = await ch.messages.fetch(msg.content)
                                                    if (fetchedMsg) {

                                                        await guildData.newReactrole(fetchedMsg.id).then(async (res) => {

                                                            const reply = await message.channel.send(lang.reactionRole.successDel).then(async (replyMSG) => {
                                                                setTimeout(async () => {
                                                                    await replyMSG.delete();
                                                                    await mp.delete();
                                                                    return await msg.delete()
                                                                }, 2000)
                                                            })
                                                            await fetchedMsg.reactions.removeAll()


                                                        })

                                                    }

                                                } catch (err) {
                                                    console.log(err)
                                                    const reply = await message.channel.send(lang.reactionRole.msgNotFound).then(async (replyMSG) => {
                                                        setTimeout(async () => {
                                                            await replyMSG.delete();
                                                            await mp.delete();
                                                            return await msg.delete()
                                                        }, 2000)
                                                    }).catch(err => console.log(err))

                                                }




                                            }

                                        })
                                })
                            })
                    })


                } else if (r.emoji.name === '✅') {
                    if (msgId.get(message.guild.id) == "Non définie") {
                        return await message.channel.send(lang.reactionRole.noMsg).then(async (replyMSG) => {
                            setTimeout(async () => {
                                return await replyMSG.delete();
                            }, 2000)
                        })
                    } else if (emojiRoleMapping.size == 0) {
                        return await message.channel.send(lang.reactionRole.noEmoji).then(async (replyMSG) => {
                            setTimeout(async () => {
                                return await replyMSG.delete();

                            }, 2000)
                        })
                    }
                    const fetchedMsg = await message.guild.channels.cache.get(chs.get(message.guild.id)).messages.fetch(msgId.get(message.guild.id))
                    for (const [key, value] of emojiRoleMapping) {
                        await fetchedMsg.react(`${key}`)
                    }
                    const emojiRoleArray = Object.fromEntries(emojiRoleMapping)
                    await guildData.newReactrole(msgId.get(message.guild.id), emojiRoleArray)


                }

                function updateEmbed() {
                    let emojiArray;
                    let emoji = []
                    let chMsg = chs.get(message.guild.id)
                    if (!isNaN(chs.get(message.guild.id))) chMsg = `<#${chs.get(message.guild.id)}>`
                    if (emojiRoleMapping.size !== 0) {
                        emojiArray = Object.fromEntries(emojiRoleMapping)

                        if (emojiArray.length === 0) {
                            emoji.push('Non définie')
                        } else {
                            for (const [key, value] of Object.entries(emojiArray)) {
                                let emojis
                                if (!isNaN(key)) {
                                    const ee = client.emojis.cache.get(key)
                                    if (ee.animated) {
                                        emojis = `<a:${ee.name}:${ee.id}>・<@&${value}>\n`
                                    } else {
                                        emojis = `<:${ee.name}:${ee.id}>・<@&${value}>\n`

                                    }
                                } else {
                                    emojis = `${key}・<@&${value}>\n`
                                }
                                emoji.push(emojis)
                            }
                        }

                    } else {
                        emoji.push('Non définie')
                    }

                    embed.setDescription(lang.reactionRole.embedDescription(chMsg, msgId.get(message.guild.id), emoji))
                    msg.edit({ embeds: [embed] })
                }

            });
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    const replyMsg = await message.channel.send(lang.error.timeout)
                    msgId.delete(message.guild.id);
                    chs.delete(message.guild.id);
                    emojiRoleMapping.clear();

                    setTimeout(() => {
                        replyMsg.delete()
                    }, 2000)
                }
                if (reason === 'user_stop') {
                    msgId.delete(message.guild.id);
                    chs.delete(message.guild.id);
                    emojiRoleMapping.clear();

                }
                if (reason === "messageDelete") {
                    msgId.delete(message.guild.id);
                    chs.delete(message.guild.id);
                    emojiRoleMapping.clear();
                }


            })
        });


    }
};


