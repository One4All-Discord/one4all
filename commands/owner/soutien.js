const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const soutienId = new Map();
const soutienMsg = new Map();
const soutienOn = new Map();
let SqlString = require('sqlstring');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'soutien',
            description: 'Show the menu for the soutient | Affiche le menu pour le soutient',
            usage: 'soutien <config>',
            clientPermissions: [PermissionFlagsBits.AddReactions],
            category: 'owners',
            guildOwnerOnly: true,
            cooldown: 2

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang)

        const color = guildData.color
        const config = args[0] === "config";
        const count = args[0] === "count"

        soutienId.set(message.guild.id, guildData.config.soutienId);

        soutienMsg.set(message.guild.id, guildData.config.soutienMsg);
        if (!args[0]) {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: `Informations Soutien`, iconURL: client.user.displayAvatarURL() })
                .setFooter({ text: "Informations Soutien", iconURL: client.user.displayAvatarURL() })
                .addFields({ name: '🆘 Soutien:', value: `[\`soutien config\`](https://discord.gg/TfwGcCjyfp) ・ Configuration du système de soutien\n[\`soutien count\`](https://discord.gg/TfwGcCjyfp) ・ Montrez combien de membres vous soutiennent` })
            message.reply({ embeds: [embed] })
        }
        if (config) {
            const msg = await message.reply(lang.loading)

            await msg.react("1️⃣");
            await msg.react("2️⃣");
            await msg.react("3️⃣");
            await msg.react("❌");
            await msg.react('✅')
            const isOn = guildData.config.soutienOn
            let isOnS
            if (!isOn) {
                isOnS = '▫️'
            }
            if (isOn) {
                isOnS = '▫️'
            }

            const embed = new Embed(client, guildData)
                .setAuthor({ name: lang.soutien.title, iconURL: client.user.displayAvatarURL() })
                .setDescription(lang.soutien.description(soutienId, soutienMsg, isOnS, message.guild))
            msg.edit({ embeds: [embed] })
            const data_res = msg.createReactionCollector({ filter: (reaction, user) => user.id === message.author.id, time: 120000 });
            data_res.on("collect", async (reaction) => {
                await reaction.users.remove(message.author);
                if (reaction.emoji.name === "1️⃣") {
                    let question = await message.reply(lang.soutien.roleQ)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages({ filter: filter, 
                        max: 1,
                        time: 30000,
                    }).then(async (collected) => {

                        await collected.first().delete()
                        question.delete()
                        if (collected.first().content.toLowerCase() === "cancel") {
                            return message.reply(lang.cancel);
                        }
                        const response = collected.first().mentions.roles.first();
                        const channelId = response.id;

                        message.reply(lang.soutien.success(response))
                        soutienId.set(message.guild.id, channelId)
                        updateEmbed()

                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.soutien.errorTimeOut)
                    })
                } else if (reaction.emoji.name === "2️⃣") {

                    let question = await message.reply(lang.soutien.msgQ)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages({ filter: filter, 
                        max: 1,
                        time: 120000,
                    }).then(async (collected) => {

                        await collected.first().delete()
                        if (collected.first().content.toLowerCase() === "cancel") {
                            return message.reply(lang.cancel);
                        }
                        let response = collected.first().content;

                        updateEmbed()
                        message.reply(lang.soutien.successEditRl);
                        message.reply(`${response}`);
                        soutienMsg.set(message.guild.id, response)
                        let question = await message.reply(lang.soutien.rmAllRlQ)
                        const filter = m => message.author.id === m.author.id;
                        message.channel.awaitMessages({ filter: filter, 
                            max: 1,
                            time: 120000,
                        }).then(async (collected) => {

                            await collected.first().delete()
                            question.delete()
                            const response = collected.first().content.toLowerCase();
                            const rlId = soutienId.get(message.guild.id)
                            if (collected.first().content.toLowerCase() === "cancel") {
                                return message.reply(lang.cancel);
                            } else if (response === lang.yes) {
                                try {
                                    const Role = message.guild.roles.cache.get(rlId);
                                    Role.members.forEach((member) => { // Looping through the members of Role.
                                        setTimeout(() => {
                                            member.roles.remove(Role); // Removing the Role.
                                        }, 1000);
                                    });
                                } catch (err) {
                                    console.log(err)
                                    return message.reply(lang.soutien.errorRmAllRl(rlId))
                                }
                            } else if (response === lang.no) {
                                return message.reply(lang.soutien.successNo)
                            } else if (collected.first().content.toLowerCase() !== lang.no || collected.first().content.toLowerCase() !== lang.yes) {
                                return message.reply(lang.error.NoYes)
                            }
                            message.reply(lang.soutien.removingRl(rlId))
                        }).catch((error) => {
                            console.log(error)
                            message.reply(lang.soutien.errorTimeOut2M)
                        })
                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.soutien.errorChMsg);
                        return message.reply(`${response}`);
                    })

                } else if (reaction.emoji.name === "3️⃣") {
                    let question = await message.reply(lang.soutien.enableQ)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages({ filter: filter, 
                        max: 1,
                        time: 120000,
                    }).then(async (collected) => {
                        await collected.first().delete()
                        question.delete()
                        if (collected.first().content.toLowerCase() === "cancel") {
                            return message.reply(lang.cancel);
                        } else if (collected.first().content.toLowerCase() === lang.yes) {

                            message.reply(lang.soutien.successEnable);
                            soutienOn.set(message.guild.id, true)
                            updateEmbed()
                        } else if (collected.first().content.toLowerCase() === lang.no) {

                            message.reply(lang.soutien.successDisable);
                            soutienOn.set(message.guild.id, false)

                        } else if (collected.first().content.toLowerCase() !== lang.no || collected.first().content.toLowerCase() !== lang.yes) {
                            return message.reply(lang.error.NoYes)
                        }
                        updateEmbed()
                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.soutien.errorTimeOut2M)
                    })
                } else if (reaction.emoji.name === "❌") {

                    await data_res.stop()
                    return await msg.delete()
                }else if(reaction.emoji.name === "✅"){
                    guildData.updateSoutien(soutienId.get(message.guild.id), soutienMsg.get(message.guild.id), soutienOn.get(message.guild.id))
                }

            });
            data_res.on('end', collected => {
                message.reply(lang.cancel)
            });

            function updateEmbed() {
                embed.setDescription(lang.soutien.description(soutienId, soutienMsg, isOnS, message.guild))
                msg.edit({ embeds: [embed] })
            }
        } else if (count) {
            const rlId = soutienId.get(message.guild.id);
            const Role = message.guild.roles.cache.get(rlId);
            const count = Role.members.size;
            let Embed = new Embed(client, guildData)
                .setAuthor({ name: "🆘 __Soutient__", iconURL: client.user.displayAvatarURL() })
                .setDescription(lang.soutien.descriptionCount(count))
                .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            message.reply({ embeds: [Embed] })

        }
    }
}