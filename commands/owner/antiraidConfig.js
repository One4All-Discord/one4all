const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
const NumberFromEmoji = require('../../utils/emojiToNumber')
const emojiEnable = {
    true: "▫️",
    false: "▫️"
}
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'antiraid',
            description: "Setup the antiraid | Configurer l'antiraid",
            usage: 'antiraid',
            clientPermissions: [PermissionFlagsBits.AddReactions, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.EmbedLinks],
            category: 'owners',
            guildOwnerOnly: true,
            // onlyTopGg: true
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        let lang = client.lang(guildData.lang);

        const color = parseInt(guildData.color.replace('#', ''), 16)
        if (!args[0]) {
            const Embed = require('../../structures/Embed');
            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Anti-Raid', iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    `\`antiraid on\` — Activer tout l'antiraid\n` +
                    `\`antiraid off\` — Désactiver tout l'antiraid\n` +
                    `\`antiraid opti\` — Configuration optimale\n` +
                    `\`antiraid config\` — Configuration détaillée\n`
                );
            return message.reply({ embeds: [embed] });
        }
        if (args[0] === "on") {
            const {enable} = guildData.antiraid;
            for (const [name, _] of Object.entries(enable)) {
                enable[name] = true;
            }
            await guildData.updateAntiraid(guildData.antiraid)
            await message.reply(lang.antiraidConfig.allOn)


        }
        if (args[0] === "off") {
            const {enable} = guildData.antiraid;
            for (const [name, _] of Object.entries(enable)) {
                enable[name] = false;
            }
            await guildData.updateAntiraid(guildData.antiraid)
            await message.reply(lang.antiraidConfig.allOff)
        }
        if (args[0] === "opti") {
            const {enable, config, bypass} = guildData.antiraid
            for (const [name, _] of Object.entries(enable)) {
                enable[name] = true;
            }
            config["webhookUpdate"] = "ban"
            bypass["webhookUpdate"] = false

            config["roleCreate"] = "kick"
            bypass["roleCreate"] = true

            config["roleUpdate"] = "unrank"
            bypass["roleUpdate"] = true

            config["roleDelete"] = "unrank"
            bypass["roleDelete"] = true

            config["channelCreate"] = "kick"
            bypass["channelCreate"] = false

            config["channelUpdate"] = "kick"
            bypass["channelUpdate"] = false

            config["channelCreate"] = "kick"
            bypass["channelCreate"] = false


            config["channelDelete"] = "kick"
            bypass["channelDelete"] = false

            bypass["antiSpam"] = true

            config["antiMassBan"] = "unrank"
            config["antiMassBanLimit"] = 6
            bypass["antiMassBan"] = false

            config['antiBot'] = "kick"
            bypass["antiBot"] = false

            config["roleAdd"] = "unrank"
            bypass["roleAdd"] = true

            bypass["antiLink"] = true

            config["antiDeco"] = "unrank"
            config["antiDecoLimit"] = 4
            bypass["antiDeco"] = true

            config["antiKick"] = "unrank"
            config["antiKickLimit"] = 2
            bypass["antiKick"] = true

            config["antiDc"] = "kick"
            config["antiDcLimit"] = "1d"

            config["regionUpdate"] = "unrank"
            bypass["regionUpdate"] = false

            config["nameUpdate"] = "kick"
            bypass["nameUpdate"] = false

            config["vanityUpdate"] = "ban"
            bypass["vanityUpdate"] = false

            await guildData.updateAntiraid(guildData.antiraid)
            message.reply(lang.antiraidConfig.opti)
        }
        if (args[0] === "config") {
            const msg = await message.reply(lang.loading)
            const emojis = ['◀', '1️⃣', "2️⃣", '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '▶', '❌']
            for await(const em of emojis) {
                await msg.react(em)
            }


            const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;


            let fields = []

            let antiraidConfig = {...guildData.antiraid};
            let {enable, config, bypass} = antiraidConfig;
            let arrayEnable = Object.entries(enable)
            let page = 0
            const initFields = (renew) => {
                if (renew) fields = [];
                let i = 0;
                for (const [name, isEnable] of Object.entries(enable)) {
                    i++
                    if (i > 9) i = 1
                    fields.push({
                        name: `${i} ・ ${name}`,
                        value: `Actif: ${emojiEnable[isEnable]}`
                    })

                }
                i = 0
                for (let [name, sanction] of Object.entries(config)) {
                    if (name.toLowerCase().endsWith('limit')) {
                        const eventName = name.toLowerCase().split('limit')[0]
                        const field = fields.filter(field => field.name.toLowerCase().includes(eventName))
                        field[0].value += `\nLimite: **${sanction}**`

                    } else {
                        if (i < Object.entries(config).length) {
                            if (name.includes("antiSpam")) sanction = "mute"
                            let field = fields.filter(field => field.name.includes(name))
                            field[0].value += `\nSanction: **${sanction}**`


                        }
                    }
                    i++


                }
                i = 0
                for (const [name, bp] of Object.entries(bypass)) {
                    if (i < fields.length && name !== "antiDc") {
                        let field = fields.filter(field => field.name.includes(name))
                        field[0].value += `\nWhitelist bypass : **${!bp ? 'Non' : 'Oui'}**\n`
                        i++
                    }
                }
            }
            let embed = (page) => {
                initFields(true)
                return [{

                    fields: fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length),

                    color,
                    timestamp: new Date(),
                    footer: {
                        text: `Antiraid Config  ${page < 1 ? 1 : 2}/${parseInt(arrayEnable.length / 9)}`,
                        icon_url: message.author.displayAvatarURL() || ''
                    },
                },

                ]
            }
            let editMenu = async (index, subMenu) => {

                await subMenu.reactions.removeAll()
                let pageSection = fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length)
                const name = pageSection[index].name.split('・')[1]
                let splitedValue = pageSection[index].value.split('\n').filter(x => x !== "")
                const eventName = name.split(' ')[1]

                const putEmoji = () => {
                    splitedValue = pageSection[index].value.split('\n').filter(x => x !== "")
                    splitedValue[0] = `\`🟢\` ${splitedValue[0]}`
                    if (eventName !== "antiSpam") {
                        splitedValue[1] = `\`🔵\` ${splitedValue[1]}`

                    }
                    splitedValue[2] = `\`🟣\` ${splitedValue[2]}`
                    if (splitedValue.length > 3) splitedValue[3] = `\`🟤\` ${splitedValue[3]}`

                    return pageSection[index].value = splitedValue.join('\n')
                }
                putEmoji()


                await subMenu.edit({ embeds: [{
                        title: name,
                        description: pageSection[index].value,
                        color,
                        timestamp: new Date(),
                        footer: {
                            text: name,
                            icon_url: message.author.displayAvatarURL() || ''
                        },
                    }]

                })
                const indispensableEmoji = ['↩', '❌']

                await subMenu.react(indispensableEmoji[0])
                addEmoji: for (let i = 1; i <= splitedValue.length; i++) {
                    if (eventName === "antiSpam" && i === 2) continue addEmoji
                    const em = NumberFromEmoji.toEmoji(i)
                    await subMenu.react(em)
                    indispensableEmoji.push(em)
                }

                let emojiQuestion = {
                    "🔵": {question: lang.antiraidConfig.sanctionQ, type: 'sanction'},

                }
                if (splitedValue.length >= 4) {
                    emojiQuestion[indispensableEmoji[4]] = {question: lang.antiraidConfig.limitQ, type: 'limit'}
                }
                await subMenu.react(indispensableEmoji[1])
                let emojiFilter = (reaction, user) => indispensableEmoji.includes(reaction.emoji.name) && user.id === message.author.id,
                    dureefiltrer = response => {
                        return response.author.id === message.author.id
                    };
                const collector = subMenu.createReactionCollector({ filter: emojiFilter, time: 900000});
                collector.on('collect', async r => {

                    await r.users.remove(message.author);

                    if (r.emoji.name === indispensableEmoji[0]) {

                        subMenu.edit({ embeds: [embed(page)[0]] })
                        await subMenu.reactions.removeAll()
                        for (const em of emojis) {
                            await subMenu.react(em)
                        }
                        return collector.stop()
                    } else if (r.emoji.name === indispensableEmoji[1]) {
                        collector.stop()
                        subMenu.delete();
                    } else if (r.emoji.name === indispensableEmoji[2]) {
                        const isEnable = enable[name.split(' ')[1]]
                        enable[eventName] = isEnable === false


                    } else if (r.emoji.name === indispensableEmoji[indispensableEmoji.length - 1]) {
                        const bypassEnable = bypass[name.split(' ')[1]]
                        bypass[eventName] = bypassEnable === false

                    }
                    if (Object.keys(emojiQuestion).includes(r.emoji.name)) {
                        const {question, type} = emojiQuestion[r.emoji.name];
                        await message.reply(question).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(cld => {
                                    let msg = cld.first();
                                    if (type === 'limit') {
                                        if (eventName === "antiDc") {
                                            if (isNaN(msg.content.split('')[0]) || !msg.content.endsWith('s') || !msg.content.endsWith('m') || !msg.content.endsWith('h') || !msg.content.endsWith('d') || !msg.content.endsWith('w') || !msg.content.endsWith('y')) {
                                                return message.reply(lang.antiraidConfig.antiDcError)
                                            }
                                        } else {
                                            if (isNaN(!msg.content)) {
                                                return message.reply(lang.antiraidConfig.limitError)
                                            }
                                        }
                                        config[`${eventName}Limit`] = msg.content;

                                    } else {
                                        if (eventName === 'antiDc' && msg.content === 'unrank') {
                                            return message.reply(lang.antiraidConfig.antiDcUnrank)
                                        }
                                        config[eventName] = msg.content;

                                    }

                                    mp.delete()
                                    msg.delete()
                                    initFields(true)
                                    pageSection = fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length)
                                    putEmoji()
                                    return subMenu.edit({ embeds: [{
                                            title: name,
                                            description: pageSection[index].value,
                                            color,
                                            timestamp: new Date(),
                                            footer: {
                                                text: name,
                                                icon_url: message.author.displayAvatarURL() || ''
                                            },
                                        }]

                                    })
                                });
                        })

                    }
                    initFields(true)
                    pageSection = fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length)
                    putEmoji()

                    return await subMenu.edit({ embeds: [{
                            title: name,
                            description: pageSection[index].value,
                            color,
                            timestamp: new Date(),
                            footer: {
                                text: name,
                                icon_url: message.author.displayAvatarURL() || ''
                            },
                        }]

                    })


                })


            }
            const saveFilter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
            const confirMsg = await message.reply(lang.antiraidConfig.reactsave)
            await confirMsg.react('✅')
            const saveCollector = confirMsg.createReactionCollector({ filter: saveFilter, time: 900000});
            saveCollector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === '✅') {
                    await guildData.updateAntiraid(antiraidConfig)
                    const replyMsg = message.reply(lang.antiraidConfig.savedmsg);
                    setTimeout(async () => {
                        await saveCollector.stop();

                    }, 5000)
                }
            });

            msg.edit({ embeds: [embed(page)[0]] }).then(async m => {
                const collector = m.createReactionCollector({ filter: filter, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === emojis[0]) {
                        if (page < 1) {
                            page = 1
                        } else {
                            page--
                        }


                        return msg.edit({ embeds: [embed(page)[0]] })
                    } else if (r.emoji.name === emojis[emojis.length - 2]) {
                        if (page >= arrayEnable.length / 9) {
                            page = 0
                        } else {
                            page++
                        }


                        return msg.edit({ embeds: [embed(page)[0]] })
                    } else if (r.emoji.name === emojis[emojis.length - 1]) {

                        msg.delete()
                        saveCollector.stop()
                        confirMsg.delete()
                        return collector.stop();
                    }
                    const number = NumberFromEmoji.fromEmoji(r.emoji.name)
                    await editMenu(number - 1, msg)

                })


            })
            saveCollector.on('end', async (_, reason) => {
                await confirMsg.delete();
                await msg.reactions.removeAll()
                await msg.delete()
                if (reason === "time") {
                    const timeoutmsg = await message.reply(lang.antiraidConfig.timeoutmsg);
                    setTimeout(async () => {
                        timeoutmsg.delete()
                    }, 5000)
                }

            });
        }
    }
}
