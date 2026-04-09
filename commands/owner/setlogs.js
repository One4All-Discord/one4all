const Embed = require('../../structures/Embed');
const { EmbedBuilder } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setlogs',
            description: 'Setup the logs channel | Configurer le logs',
            usage: 'setlogs',
            tags: ['guildOnly'],
            category: 'owners',
            guildOwnerOnly: true,
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        let modLog = new Map();
        let msgLog = new Map();
        let raidLog = new Map();
        let voiceLog = new Map();
        let owner = message.guild.ownerId;


        const lang = client.lang(guildData.lang)
        const color = guildData.color
        const logs = guildData.logs;
        modLog.set(message.guild.id, logs.modLog)
        msgLog.set(message.guild.id, logs.msgLog)
        voiceLog.set(message.guild.id, logs.voiceLog)
        raidLog.set(message.guild.id, logs.antiraidLog)

        const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const setlogsMsg = await message.reply(lang.loading)
        const reaction = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌', '✅']
        for (let reac of reaction) {
            await setlogsMsg.react(reac)
        }
        const logsEmbed = new Embed(client, guildData)
            .setAuthor({ name: lang.setlogs.embedTitle, iconURL: client.user.displayAvatarURL() })
            .setDescription(lang.setlogs.embedDescription(raidLog.get(message.guild.id), modLog.get(message.guild.id), voiceLog.get(message.guild.id), msgLog.get(message.guild.id)))
        setlogsMsg.edit({ embeds: [logsEmbed] })
            .then(async m => {
                const collector = m.createReactionCollector({ filter: filter, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === '1️⃣') {
                        message.reply(lang.setlogs.raidChQ).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                        return message.reply(lang.setlogs.errorNotChannel)
                                    }
                                    if (msg.content === 'off') {
                                        await message.reply(lang.setlogs.disable("raid")).then((e) => {
                                            raidLog.set(message.guild.id, 'Non définie');
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

                                        const replyMsg = message.reply(lang.setlogs.successRaidCh(ch)).then((replyMSG) => {
                                            updateEmbed()
                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                            }, 2000)

                                        })
                                        raidLog.set(message.guild.id, ch.id)

                                    }

                                });
                        })
                    } else if (r.emoji.name === '2️⃣') {
                        message.reply(lang.setlogs.modChQ).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                        return message.reply(lang.setlogs.errorNotChannel)
                                    }
                                    if (msg.content === 'off') {
                                        await message.reply(lang.setlogs.disable("modération")).then((e) => {
                                            modLog.set(message.guild.id, 'Non définie');
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

                                        const replyMsg = message.reply(lang.setlogs.successModCh(ch)).then((replyMSG) => {
                                            updateEmbed()
                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                            }, 2000)

                                        })
                                        modLog.set(message.guild.id, ch.id)

                                    }

                                    console.log(modLog)
                                });
                        })
                    } else if (r.emoji.name === '3️⃣') {
                        message.reply(lang.setlogs.vocChQ).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                        return message.reply(lang.setlogs.errorNotChannel)
                                    }
                                    if (msg.content === 'off') {
                                        await message.reply(lang.setlogs.disable("vocal")).then((e) => {
                                            voiceLog.set(message.guild.id, 'Non définie');
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
                                        const replyMsg = message.reply(lang.setlogs.successVocCh(ch)).then((replyMSG) => {
                                            updateEmbed()
                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                            }, 2000)

                                        })
                                        voiceLog.set(message.guild.id, ch.id)
                                    }


                                });
                        })
                    } else if (r.emoji.name === '4️⃣') {
                        message.reply(lang.setlogs.msgChQ).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                        return message.reply(lang.setlogs.errorNotChannel)
                                    }
                                    if (msg.content === 'off') {
                                        await message.reply(lang.setlogs.disable("messages")).then((e) => {
                                            msgLog.set(message.guild.id, 'Non définie');
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

                                        const replyMsg = message.reply(lang.setlogs.successMsgCh(ch)).then((replyMSG) => {
                                            updateEmbed()
                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                            }, 2000)

                                        })
                                        msgLog.set(message.guild.id, ch.id)

                                    }

                                });
                        })

                    } else if (r.emoji.name === '❌') {
                        message.reply(lang.setlogs.cancel).then((mp) => {
                            voiceLog.delete(message.guild.id);
                            msgLog.delete(message.guild.id);
                            raidLog.delete(message.guild.id);
                            modLog.delete(message.guild.id);
                            collector.stop();
                            setTimeout(async () => {
                                mp.delete()
                            }, 2000)
                            return setlogsMsg.delete();

                        })
                    } else if (r.emoji.name === '✅') {
                        message.reply(lang.setlogs.save).then(async (mp) => {
                            await guildData.updateLogs(modLog.get(message.guild.id), msgLog.get(message.guild.id), voiceLog.get(message.guild.id),  raidLog.get(message.guild.id)).then(() =>{
                                collector.stop();
                                setTimeout(async () => {
                                    mp.delete()
                                }, 2000)
                                voiceLog.delete(message.guild.id);
                                msgLog.delete(message.guild.id);
                                raidLog.delete(message.guild.id);
                                modLog.delete(message.guild.id);
                                return setlogsMsg.delete();
                            })


                        })
                    }
                })

                function updateEmbed() {
                    logsEmbed.setDescription(lang.setlogs.embedDescription(raidLog.get(message.guild.id), modLog.get(message.guild.id), voiceLog.get(message.guild.id), msgLog.get(message.guild.id)))
                    setlogsMsg.edit({ embeds: [logsEmbed] })


                }
            })


    }
}
