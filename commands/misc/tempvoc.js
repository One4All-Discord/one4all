const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const StateManager = require('../../utils/StateManager');
const categoryNameMapping = new Map();
const enable = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'tempvoc',
            description: 'Show the tempvoc menu | Afficher le menu de vocal temporaire',
            usage: 'tempvoc',
            category: 'misc',
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);


        const color = guildData.color
        const lang = client.lang(guildData.lang)
        const msg = await message.channel.send(lang.loading);
        const emojis = ['🕳', '💬', '💨', '💥', '❌', '✅']
        for (const emoji of emojis) {
            await msg.react(emoji)
        }
        const {tempVoc} = message.guild;
        categoryNameMapping.set(message.guild.id, guildData.tempVoc)
        enable.set(message.guild.id, !tempVoc.isOn ? 'Désactivé' : 'Activé')


        const embed = new EmbedBuilder()
            .setTitle(lang.tempvoc.embedTitle)
            .setDescription(lang.tempvoc.embedDescription(categoryNameMapping.get(message.guild.id).chName, enable.get(message.guild.id)))
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter({ text: client.user.username });

        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        msg.edit({ embeds: [embed] }).then(async m => {
            const collector = m.createReactionCollector({ filter: filter, time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === emojis[0]) {
                    message.channel.send(lang.tempvoc.loadingCreation).then((loading) => {
                        message.guild.channels.create(lang.tempvoc.autoCat, {
                            type: ChannelType.GuildCategory,
                            permissionsOverwrites: [{
                                id: message.guild.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
                            }],
                            reason: `Auto config tempvoc`
                        }).then(c => {
                            categoryNameMapping.set(message.guild.id, {
                                catId: c.id,
                                chId: 'Non définie',
                                chName: 'Non définie',
                                isOn: tempVoc.isOn
                            })
                            c.guild.channels.create(lang.tempvoc.autoChName, {
                                type: ChannelType.GuildVoice,
                                parent: c.id,
                                permissionOverwrites: [
                                    {
                                        id: message.guild.id,
                                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
                                    },
                                ],
                                reason: `Auto config tempvoc`
                            }).then(v => {
                                loading.edit(lang.tempvoc.autoConfigFinish).then(finish => {
                                    categoryNameMapping.set(message.guild.id, {
                                        catId: c.id,
                                        chId: v.id,
                                        chName: 'Non définie',
                                        isOn: tempVoc.isOn

                                    })

                                    setTimeout(() => finish.delete().catch(() => {}), 3000);
                                    updateEmbed()
                                })
                            });
                        })
                    })
                }
                if (r.emoji.name === emojis[1]) {
                    await message.channel.send(lang.tempvoc.nameQ).then(mp => {
                        mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 50000})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() === "cancel") {
                                    const reply = await message.channel.send(lang.cancel)
                                    await setTimeout(() => reply.delete().catch(() => {}), 2000)
                                    await setTimeout(() => msg.delete().catch(() => {}), 2000)
                                    return await setTimeout(() => mp.delete().catch(() => {}), 2000)
                                }
                                if (!msg.content.includes('{username}') && msg.content.toLowerCase() !== 'cancel') {
                                    return await message.channel.send(lang.tempvoc.errorNoUsername).then(async (replyMSG) => {
                                        setTimeout(async () => {
                                            await msg.delete();
                                            await mp.delete();
                                            return await replyMSG.delete();
                                        }, 2000)
                                    })
                                }
                                const info = categoryNameMapping.get(message.guild.id)
                                categoryNameMapping.set(message.guild.id, {
                                    catId: info.catId,
                                    chId: info.chId,
                                    chName: msg.content,
                                    isOn: info.isOn
                                })
                                updateEmbed()
                                setTimeout(async () => {
                                    await mp.delete();
                                    await msg.delete();
                                }, 3000)
                            })
                    })
                }
                if (r.emoji.name === emojis[2]) {
                    if (enable.get(message.guild.id) === 'Désactivé') {
                        enable.set(message.guild.id, 'Activé')

                    } else {
                        enable.set(message.guild.id, 'Désactivé')

                    }
                    updateEmbed()
                }
                if (r.emoji.name === emojis[3]) {
                    await guildData.newTempvoc(null, false).then(async () => {
                        await message.channel.send(lang.reactionRole.successDel).then(async (replyMSG) => {
                            setTimeout(async () => {
                                await replyMSG.delete();
                                return await msg.delete()
                            }, 2000)
                        })
                    })

                }
                if (r.emoji.name === emojis[4]) {
                    message.channel.send(lang.tempvoc.cancel).then((mp) => {
                        enable.delete(message.guild.id);
                        categoryNameMapping.delete(message.guild.id);
                        collector.stop('user_stop');
                        setTimeout(async () => {
                            mp.delete()
                        }, 2000)
                        return msg.delete();

                    })
                }
                if (r.emoji.name === emojis[5]) {
                    const info = categoryNameMapping.get(message.guild.id)
                    if (info.catId === 'Non définie') {
                        return await message.channel.send(lang.tempvoc.noCat).then(async (replyMSG) => {
                            setTimeout(async () => {
                                return await replyMSG.delete();
                            }, 2000)
                        })
                    }
                    let isOn;
                    if (enable.get(message.guild.id) === 'Activé') isOn = true
                    if (enable.get(message.guild.id) === 'Désactivé') isOn = false
                    categoryNameMapping.set(message.guild.id, {
                        catId: info.catId,
                        chName: info.chName,
                        chId: info.chId,
                        isOn: isOn
                    })
                    await guildData.newTempvoc(categoryNameMapping.get(message.guild.id), true)
                    return message.channel.send(lang.tempvoc.success).then(async (replyMSG) => {
                        setTimeout(async () => {
                            await msg.delete();
                            return await replyMSG.delete();
                        }, 2000)
                    })
                }

                function updateEmbed() {
                    embed.setDescription(lang.tempvoc.embedDescription(categoryNameMapping.get(message.guild.id).chName, enable.get(message.guild.id)))
                    msg.edit({ embeds: [embed] })


                }
            })
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    const replyMsg = await message.channel.send(lang.error.timeout)
                    enable.delete(message.guild.id);
                    categoryNameMapping.delete(message.guild.id);

                    setTimeout(() => {
                        replyMsg.delete()
                    }, 2000)
                }
                if (reason === 'user_stop') {
                    enable.delete(message.guild.id);
                    categoryNameMapping.delete(message.guild.id);

                }
                if (reason === "messageDelete") {
                    enable.delete(message.guild.id);
                    categoryNameMapping.delete(message.guild.id);
                }


            })
        })
    }
}

