const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const fs = require("fs");
const ms = require("ms");
const StateManager = require('../../utils/StateManager');
const time = new Map();
const ch = new Map();
const gain = new Map();
const vc = new Map();
const winner = new Map();
const prettyMilliseconds = require('pretty-ms');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'gcreate',
            description: 'Create giveaways | Creer des giveaways',
            usage: 'gcreate',
            category: 'giveaway',
            aliases: ['gstart'],
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.SendMessages],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const lang = client.lang(guildData.lang)

        const color = guildData.color
        const filter = (reaction, user) => ['🕙', '🏷️', '🎁', '✅', '🕵️'].includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        let msg = await message.channel.send(lang.loading)
        await msg.react("🕙")
        await msg.react("🏷️")
        await msg.react("🕵️")
        await msg.react("🎁")
        await msg.react("✅")
        await time.set(message.guild.id, null);
        await gain.set(message.guild.id, null);
        await ch.set(message.guild.id, null);
        await vc.set(message.guild.id, '0');
        await winner.set(message.guild.id, null);
        let msgembed = new Embed(client, guildData)
            .setAuthor({ name: `🎉 ${message.guild.name}` })
            .setDescription(`◈ **INFORMATIONS:**\n\n Cliquez 🕙 pour modifier la durée \n Cliquez 🏷️ pour modifier le salon \n Cliquez 🕵️ pour modifier le nombre de gagnant   \n Cliquez 🎁 pour modifier le gain \n Cliquez ✅ pour lancer le giveaway\n\n◈ **SETUP:** \n\n🕙  Durée **-** aucune durée définie\n🏷️ Salon **-** aucun salon définie\n🕵️ Nombre de gagnant **-** Aucun pour le moment\n🎁 Gain **-** aucun gain pour le moment`)

        msg.edit({ embeds: [msgembed] })
            .then(async m => {
                const collector = m.createReactionCollector({ filter: filter, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === '🕙') {
                        message.channel.send(`🕙 Combien de temps doit durer le giveaway ?`).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(cld => {
                                    let msg = cld.first();
                                    if (!msg.content.endsWith("d") && !msg.content.endsWith("h") && !msg.content.endsWith("m") && !msg.content.endsWith("s")) return message.channel.send(`🕙 Temps incorrect.`)
                                    time.set(message.guild.id, ms(msg.content))
                                    message.channel.send(`🕙 Vous avez changé le temps du prochain giveaway à \`${msg.content}\``).then(() => {
                                        updateEmbed()
                                    })
                                });
                        })
                    } else if (r.emoji.name === '🏷️') {

                        message.channel.send(`🏷️ Dans quel channel voulez-vous envoyer le giveaway ?`).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(cld => {
                                    let msg = cld.first();
                                    let channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content)
                                    if (!channel) return message.channel.send(` 🏷️ Salon incorrect.`)
                                    message.channel.send(` 🏷️ Vous avez changé le salon du prochain giveaway à \`${channel.name}\``).then(() => {
                                        ch.set(message.guild.id, channel.id);
                                        updateEmbed()
                                    })

                                });
                        });

                    } else if (r.emoji.name === '🕵️') {
                        message.channel.send(`🕵️ Veuillez entrer le nombre de gagnant`).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(cld => {
                                    let msg = cld.first();
                                    if (isNaN(msg.content)) return message.channel.send(`Vous devez entrer uniquement des chiffres.`)

                                    message.channel.send(` 🕵️ Vous avez changé le nombre de gagnants prédéfinis à ${msg.content}`).then(() => {
                                        winner.set(message.guild.id, msg.content);
                                        updateEmbed()

                                    })

                                });
                        });

                    } else if (r.emoji.name === '🎁') {
                        message.channel.send(` 🎁 Que voulez-vous faire gagner ?`).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(cld => {
                                    let msg = cld.first();
                                    gain.set(message.guild.id, msg.content)
                                    message.channel.send(`🎁 Désormais lors des prochains giveaway le lot a gagner seras \`${msg.content}\`.`)
                                    updateEmbed()
                                });
                        });
                    } else if (r.emoji.name === '✅') {
                        let channel = message.guild.channels.cache.get(ch.get(message.guild.id))
                        if (!channel) return message.channel.send(` ◈ \`ERREUR\` **Erreur rencontrée**: veuillez rédefinir le salon du giveaway.`)
                        message.channel.send(` ✅ Giveaway lancé dans ${channel}.`)
                        const gawTime = parseInt(time.get(message.guild.id));
                        client.giveaway.start(channel, {
                            time: gawTime,
                            prize: gain.get(message.guild.id),
                            winnerCount: parseInt(winner.get(message.guild.id)),
                            hostedBy: message.author,
                            messages: {
                                embedColor: `${color}`,
                                embedColorEnd: `${color}`,
                                giveaway: " ",
                                giveawayEmbed: " ",
                                giveawayEnded: " ",
                                timeRemaining: "\nTemps restant : \n**{duration}**",
                                inviteToParticipate: "Réagis avec 🎉 pour participer au giveaway     ",
                                winMessage: "Bien joué {winners}, tu as gagné **{prize}**",
                                embedFooter: "Giveaway time!",
                                noWinner: "Désole je n'ai pas pu déterminer un gagnant",
                                hostby: "Host par {user}",
                                winners: "gagnant(s)",
                                ededAt: "Fini à",
                                units: {
                                    seconds: "secondes",
                                    minutes: "minutes",
                                    hours: "heures",
                                    days: "jours",
                                    pluralS: false
                                }
                            }
                        })

                        StateManager.emit('vc', message.guild.id, vc.get(message.guild.id))

                    }

                })

                function updateEmbed() {
                    let win = winner.get(message.guild.id);
                    let channel = ch.get(message.guild.id);
                    let voice = vc.get(message.guild.id);
                    let gains = gain.get(message.guild.id);
                    if (winner.get(message.guild.id) == null) {
                        win = 'Aucun nombre de gagnant'
                    } else if (winner.get(message.guild.id) === "false") {
                        win = 'Aucun nombre de ganant'
                    } else {
                        win = `${winner.get(message.guild.id)}`
                    }
                    if (ch.get(message.guild.id) == null) {
                        channel = 'Aucun salon définie'
                    } else {
                        channel = `<#${ch.get(message.guild.id)}>`
                    }
                    if (vc.get(message.guild.id) === '0') {
                        voice = 'Désactivé'
                    } else {
                        voice = 'Activé'
                    }
                    if (gain.get(message.guild.id) == null) {
                        gains = 'Aucun gain pour le moment'
                    }
                    msgembed = new Embed(client, guildData)
                    msgembed.setAuthor({ name: `🎉 Lancement d'un giveaway sur ${message.guild.name}` })

                    msgembed.setDescription(`◈ **INFORMATIONS:**\n\n Cliquez 🕙 pour modifier la durée \n Cliquez 🏷️ pour modifier le salon \n Cliquez 🕵️ pour définir le nombre de gagnant \n Cliquez 🎁 pour modifier le gain \n Cliquez ✅ pour lancer le giveaway\n\n◈ **SETUP:** \n\n🕙  Durée **-** ${prettyMilliseconds(time.get(message.guild.id))}\n🏷️ Salon **-** ${channel}\n 🕵️ Nombre de gagnants **-** ${win} \n🎁 Gain **-** ${gains}`)

                    msg.edit({ embeds: [msgembed] })
                }
            });
    }
}
