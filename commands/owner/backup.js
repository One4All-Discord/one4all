const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const guildEmbedColor = new Map();
const backup = require('discord-backup')
let loadTimeout = new Map();
let doNotBackup = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'backup',
            description: 'Create a backup of the server | Creer un backup du serveur',
            usage: 'backup <create / list / delete>',
            category: 'owners',
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.Administrator],
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        let configEmbed;
        let msg;
        const color = guildData.color
        const lang = client.lang(guildData.lang)
        const create = args[0] === "create";
        const list = args[0] === 'list';
        const load = args[0] === 'load';
        const show = args[0] === 'info';
        const del = args[0] === 'delete'
        if (!args[0]) {
            const helpEmbed = new Embed(client, guildData)
                .setAuthor({ name: `Informations Backup`, iconURL: client.user.displayAvatarURL() })
                .setFooter({ text: "Informations Backup", iconURL: client.user.displayAvatarURL() })
                .addFields({ name: '🏠 Backup:', value: `[\`backup create\`](https://discord.gg/TfwGcCjyfp) ・ Permet de créer une backup du serveur actuel\n[\`backup delete\`](https://discord.gg/TfwGcCjyfp) ・ Permet de supprimer une backup\n[\`backup info\`](https://discord.gg/TfwGcCjyfp) ・ Permet d'afficher des informations sur la backup\n[\`backup list\`](https://discord.gg/TfwGcCjyfp) ・ Permet d'afficher la liste des toutes les backup` })
            message.reply({ embeds: [helpEmbed] })
        }
        if (create) {
        
            const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            msg = await message.reply(lang.loading)
            await msg.react('1️⃣')
            await msg.react('2️⃣')
            await msg.react('3️⃣')
            await msg.react('4️⃣')
            await msg.react('❌')
            await msg.react('✅')
            let ignoreCh = false;
            let ignoreRl = false;
            let ignoreEmo = false;
            let ignoreBans = false;
            configEmbed = new Embed(client, guildData)
                .setAuthor({ name: lang.backup.configEmbedT, iconURL: client.user.displayAvatarURL() })
                .setDescription(lang.backup.configEmbedDesc(ignoreCh, ignoreRl, ignoreEmo, ignoreBans))

            msg.edit({ content: '\u200b', embeds: [configEmbed] }).then(async m => {
                const collector = m.createReactionCollector({ filter: filter, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === '1️⃣') {
                        if (doNotBackup.has(message.author.id) && doNotBackup.get(message.author.id).includes("channels")) {
                            let ch = doNotBackup.get(message.author.id)
                            ch = ch.filter(x => x !== "channels")
                            doNotBackup.set(message.author.id, ch)
                            ignoreCh = false;

                        } else if (doNotBackup.has(message.author.id) && !doNotBackup.get(message.author.id).includes("channels")) {
                            let bn = doNotBackup.get(message.author.id)

                            bn.push('channels')
                            doNotBackup.set(message.author.id, bn)
                            ignoreCh = true;

                        } else {
                            doNotBackup.set(message.author.id, ["channels"])
                            ignoreCh = true;
                        }
                        updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans)

                    } else if (r.emoji.name === '2️⃣') {
                        if (doNotBackup.has(message.author.id) && doNotBackup.get(message.author.id).includes("roles")) {
                            let rl = doNotBackup.get(message.author.id)
                            rl = rl.filter(x => x !== "roles")
                            doNotBackup.set(message.author.id, rl)
                            ignoreRl = false;

                        } else if (doNotBackup.has(message.author.id) && !doNotBackup.get(message.author.id).includes("roles")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn.push('roles')
                            doNotBackup.set(message.author.id, bn)
                            ignoreRl = true;

                        } else {
                            doNotBackup.set(message.author.id, ["roles"])
                            ignoreRl = true;
                        }
                        updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans)
                    } else if (r.emoji.name === '3️⃣') {

                        if (doNotBackup.has(message.author.id) && doNotBackup.get(message.author.id).includes("emojis")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn = bn.filter(x => x !== "emojis")
                            doNotBackup.set(message.author.id, bn)
                            ignoreEmo = false;

                        } else if (doNotBackup.has(message.author.id) && !doNotBackup.get(message.author.id).includes("emojis")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn.push('emojis')
                            doNotBackup.set(message.author.id, bn)
                            ignoreEmo = true;

                        } else {
                            doNotBackup.set(message.author.id, ["emojis"])
                            ignoreEmo = true;
                        }
                        updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans)

                    } else if (r.emoji.name === '4️⃣') {
                        if (doNotBackup.has(message.author.id) && doNotBackup.get(message.author.id).includes("bans")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn = bn.filter(x => x !== "bans")
                            doNotBackup.set(message.author.id, bn)
                            ignoreBans = false;

                        } else if (doNotBackup.has(message.author.id) && !doNotBackup.get(message.author.id).includes("bans")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn.push('bans')
                            doNotBackup.set(message.author.id, bn)
                            ignoreBans = true;

                        } else {
                            doNotBackup.set(message.author.id, ["bans"])
                            ignoreBans = true;
                        }
                        updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans)

                    } else if (r.emoji.name === `❌`) {
                        await collector.stop();
                        await msg.delete();
                        doNotBackup.delete(message.author.id)
                        return message.reply(lang.backup.cancel)
                    } else if (r.emoji.name === '✅') {
                        const doing = await message.reply(lang.loading)
                        const guildName = new Map();
                        if (message.guild.name.includes(`'`)) {
                            guildName.set(message.guild.id, message.guild.name)
                            const newg = message.guild.name.replace(`'`, ' ')
                            message.guild.edit({
                                name: newg,
                            }, "Backup create")
                        }
                        backup.create(message.guild, {
                            maxMessagesPerChannel: 0,
                            doNotBackup: doNotBackup.get(message.author.id),
                            jsonSave: false // so the backup won't be saved to a json file
                        }).then(async (backupData) => {
                            console.log(backupData)
                            await client.getUserData(message.author).createBackup(backupData.id, message.guild.name, backupData).then(async () =>{
                                doNotBackup.delete(message.author.id)
                                if (guildName.has(message.guild.id)) {
                                    await message.guild.edit({ name: guildName.get(message.guild.id) }, "Backup create").catch(() => {});
                                    guildName.delete(message.guild.id)
                                }
                                doing.edit(lang.backup.successCreate(backupData.id))
                            })
                        })
                    }
                })
            })

        }
        if (list) {
                const backups = await client.database.models.backup.findAll({where: { userId: message.author.id }})
                const backupsName = [];
                const backupsId = [];
                for (const backup of backups) {
                    backupsName.push(backup.guildName + '  **:**');
                    backupsId.push(backup.backupId);
                }
                if (backupsName.length === 0 && backupsId.length === 0) return message.reply(`▫️ \`ERREUR\` **${message.author.username }**, vous ne posséder pas de backup`)
                const embed = new Embed(client, guildData)
                    .setAuthor({ name: `Liste des backup de __${message.author.username}__:`, iconURL: client.user.displayAvatarURL() })
                    .addFields({ name: `📝 Serveur Name`, value: `${backupsName.join('\n')}`, inline: true })
                    .addFields({ name: `📋 Backup Id`, value: `${backupsId.join('\n')}`, inline: true })
                message.reply({ embeds: [embed] })
        }
        if (load) {
            if (!guildData.isGuildOwner(message.author.id)) return message.reply(lang.error.notListOwner)

            if (loadTimeout.has(message.author.id)) return message.reply(lang.backup.timeout)
            const backupId = args[1];
            if (!backupId) return message.reply(lang.backup.noLoadId)
            const backupToLoad = await client.getUserData(message.author).getBackup(backupId);
            if (!backupToLoad) return message.reply(lang.backup.backupNoFound)

            if (backupToLoad.userId !== message.author.id) return message.reply(lang.backup.notBackupOwner)
            loadTimeout.set(message.member.id, 'true')
            backup.load(backupToLoad.guildData, message.guild, {
                clearGuildBeforeRestore: true

            }).then(() => {
                message.member.send(lang.backup.successLoad(message.guild.name))

            })

            setTimeout(() => {
                loadTimeout.delete(message.author.id)
            }, 1.2e+6)

        }
        if (show) {

            const backupId = args[1];
            if (!backupId) return message.reply(lang.backup.noLoadId)
            const backup =await client.getUserData(message.author).getBackup(backupId);
            if (!backup) return message.reply(lang.backup.backupNoFound)
            if (backup.userId !== message.author.id) return message.reply(lang.backup.notBackupOwner)

            const {guildData} = backup
            const rolesSize = guildData.roles.length;
            const emojisSize = guildData.emojis.length;
            const bansSize = guildData.bans.length;
            const banner = guildData.bannerURL;
            const ico = guildData.iconURL;
            const categories = guildData.channels.categories;
            let channelsSize = [];
            for (const cat of categories) {
                channelsSize.push(cat.children.length)
            }
            const embed = new Embed(client, guildData)
            embed.setAuthor({ name: `Information sur la backup ${backupId}`, iconURL: client.user.displayAvatarURL() })
            embed.setDescription(`🎨 Nombres de roles - **${rolesSize}**\n▫️ Nombres d'emojis - **${emojisSize}**\n📁 Nombres de catégories - **${categories.length}**\n💬 Nombres de channels - **${channelsSize.reduce((a, b) => a + b, 0)}**\n▫️ Nombres de bannis - **${bansSize}**\n🟡 Backup crée le - **${(() => { const d = new Date(guildData.createdTimestamp); return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`; })()}**`)
            embed.setTimestamp()
            if (ico !== undefined) {
                embed.setThumbnail(ico)
            }

            if (banner !== undefined) {
                embed.setImage(banner)

            }
            const chEmo = client.emojis.cache.get('783422874748584007')
            const rlEmo = client.emojis.cache.get('783422848630521857')
            let filters = (reaction, user) => [chEmo.name, rlEmo.name].includes(reaction.emoji.name) && user.id === message.author.id;
            const msg = await message.reply(lang.loading)
            const emoji = ['783422848630521857', '783422874748584007']
            for (let emo of emoji) {
                await msg.react(client.emojis.cache.get(emo))
            }
            msg.edit({ embeds: [embed] }).then(async m => {
                const collector = m.createReactionCollector({ filter: filters, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === chEmo.name) {
                        const channels = guildData.channels;
                        const childName = []
                        for (let cat of channels.categories) {
                            childName.push(`°${cat.name}`)
                            cat.children.forEach(ch => {
                                childName.push(`     ${ch.name}`)
                            })

                        }

                        embed.setDescription(`🎨 Nombres de roles - **${rolesSize}**\n▫️ Nombres d'emojis - **${emojisSize}**\n📁 Nombres de catégories - **${categories.length}**\n💬 Nombres de channels - **${channelsSize.reduce((a, b) => a + b, 0)}**\n▫️ Nombres de bannis - **${bansSize}**\n🟡 Backup crée le - **${(() => { const d = new Date(guildData.createdTimestamp); return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`; })()}**
                            \`\`\`${childName.join('\n')}\`\`\`
                            `)

                        msg.edit({ embeds: [embed] }).catch((err) => {
                            if (err.toString().includes('Invalid Form Body')) {
                                return message.reply("Il y a trop de salons à visualiser sur cette backup")
                            }
                        })

                    }
                    if (r.emoji.name === rlEmo.name) {
                        const roles = guildData.roles;
                        const rolesName = []
                        for (let rl of roles) {
                            rolesName.push(rl.name)
                        }
                        embed.setDescription(`🎨 Nombres de roles - **${rolesSize}**\n▫️ Nombres d'emojis - **${emojisSize}**\n📁 Nombres de catégories - **${categories.length}**\n💬 Nombres de channels - **${channelsSize.reduce((a, b) => a + b, 0)}**\n▫️ Nombres de bannis - **${bansSize}**\n🟡 Backup crée le - **${(() => { const d = new Date(guildData.createdTimestamp); return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`; })()}**
                            \`\`\`${rolesName.join('\n')}\`\`\`
                        `)

                        try {
                            msg.edit({ embeds: [embed] })
                        } catch (err) {
                            if (err.toString().includes('Invalid Form Body')) {
                                return message.reply("Il y a trop de roles à visualiser sur cette backup")
                            }
                        }

                    }
                })

            }).catch((err) => {
                if (err.toString().includes(`▫️ \`ERROR\`: Unknown column '${backupId}' in 'where clause'`)) return message.reply(lang.backup.backupNoFound)
                return message.reply(lang.backup.error)
            })

        }

        if (del) {
            const backupId = args[1];
            if (!backupId) return message.reply(lang.backup.noLoadId)
            const backupCheck = await client.getUserData(message.author).getBackup(backupId)
            if (!backupCheck) return message.reply(lang.backup.backupNoFound)
            if (backupCheck.userId !== message.author.id) return message.reply(lang.backup.notBackupOwner)

            await client.getUserData(message.author).deleteBackup(backupId).then(result => {
                if (result) {
                    return message.reply(lang.backup.successDelete(backupId))

                }
            })
        }

        function updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans) {
            const dd = new Embed(client, guildData)
            dd.setAuthor({ name: lang.backup.configEmbedT, iconURL: client.user.displayAvatarURL() })
            dd.setDescription(lang.backup.configEmbedDesc(ignoreCh, ignoreRl, ignoreEmo, ignoreBans))
            dd.setTimestamp()
            msg.edit({ embeds: [dd] })
        }
    }
}
