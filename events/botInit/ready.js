const {DateTime} = require('luxon');
const Event = require('../../structures/Handler/Event');
const { EmbedBuilder, ChannelType, PermissionFlagsBits, ActivityType, SlashCommandBuilder, REST, Routes } = require('discord.js');
const {GiveawaysManager} = require('discord-giveaways')
const cron = require('node-cron')
const Coins = require('../../utils/StartCoins')
const Embed = require('../../structures/Embed')
module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'clientReady',
        });
    }

    async run(client) {
        console.log(`[CLIENT LOGIN] ${client.user.username} logged in`);
        const Giveaway = class extends GiveawaysManager {
            async refreshStorage() {
                // This should make all shard refreshing their cache with the updated database
                if (client.shard) return client.shard.broadcastEval(() => this.giveaways.getAllGiveaways());
            }

            // This function is called when the manager needs to get all the giveaway stored in the database.
            async getAllGiveaways() {

                return new Promise(function (resolve, reject) {
                    client.database.models.giveaways.findAll({
                        attributes: ['data']
                    }).then(res => {
                        const giveaways = res.map((row) => {
                            return row.get().data
                        });
                        resolve(giveaways);
                    }).catch(err => console.log(err))


                });
            }

            // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
            async saveGiveaway(messageID, giveawayData) {
                return new Promise(function (resolve, reject) {
                    client.database.models.giveaways.create({
                        message_id: messageID,
                        data: giveawayData
                    }).then(() => {
                        resolve(true)
                    }).catch(err => console.log(err))

                });
            }

            async editGiveaway(messageID, giveawayData) {
                return new Promise(function (resolve, reject) {
                    client.database.models.giveaways.update({
                        data: giveawayData
                    }, {
                        where: {
                            message_id: messageID
                        }
                    }).then(() => {
                        resolve(true)
                    }).catch(err => console.log(err))

                });
            }

            // This function is called when a giveaway needs to be deleted from the database.
            async deleteGiveaway(messageID) {
                return new Promise(function (resolve, reject) {
                    client.database.models.giveaways.destroy({
                        where: {
                            message_id: messageID
                        }
                    }).then(() => {
                        resolve(true)
                    }).catch(err => console.log(err))

                });
            }
        };
        client.giveaway = new Giveaway(client, {
            storage: false, // Important - use false instead of a storage path
            updateCountdownEvery: 10000,
            default: {
                botsCanWin: false,
                embedColor: '#7289da',
                reaction: '🎉'
            }
        });


        //launc check mute
        const checkMute = require('../../utils/Mute')
        await checkMute.startChecking(client)

        // Music events are now handled in structures/Music/MusicPlayer.js




        /**
         * Log information of the bot in the console.
         * @returns {void}
         */


        console.log(
            `Client online! Client ${client.user.username} has ${client.guilds.cache.size} guilds, it sees ${client.users.cache.size} users.`
        );

        // Version auto-increment
        const fs = require('fs');
        const versionPath = require('path').resolve(__dirname, '../../version.json');
        const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
        const parts = versionData.version.split('.').map(Number);
        parts[2]++;
        versionData.version = parts.join('.');
        fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2) + '\n');
        const version = versionData.version;

        // Set presence
        client.user.setPresence({
            activities: [{ name: `v${version} | ✅ À jour`, type: ActivityType.Playing }],
            status: 'online',
        });

        // Register slash commands
        try {
            const commands = [
                new SlashCommandBuilder()
                    .setName('ping')
                    .setDescription('Affiche la latence du bot')
                    .toJSON(),
            ];
            const rest = new REST({ version: '10' }).setToken(client.token);
            await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
            console.log('[SLASH] Slash commands registered');
        } catch (e) {
            console.error('[SLASH]', e.message);
        }

        // Send restart notification
        try {
            const restartChannel = client.config.devLogChannel ? await client.channels.fetch(client.config.devLogChannel) : null;
            if (restartChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle(`Redémarrage effectué — v${version}`)
                    .setDescription(`Le bot a redémarré et est à jour.\n\n**Version:** \`${version}\``)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
                await restartChannel.send({ embeds: [embed] });
            }
        } catch (e) {
            console.error('[RESTART NOTIFICATION]', e.message);
        }

        if (client.botperso) {
            const fs = require('fs');
            const path = './config.json';
            if (fs.existsSync(path)) {
                await client.users.fetch(require('../../config.json').owner, true);
            } else {
                await client.users.fetch(process.env.OWNER, true)
            }
        }

        client.guilds.cache.forEach( guild => {
            const user = client.users.cache.get(guild.ownerId)
            if (user) {
                client.getUserData(user).fetchBlacklistedUsers();
            }

        })


        client.guilds.cache.forEach(guild => {
            if (!guild.available) return guild.leave();
        })


        cron.schedule('*/10 * * * *', () => {
            console.log('[EDITING CHANNEL] Counter starting')
            client.guilds.cache.forEach(async guild => {
                const guildData = client.getGuildData(guild.id);
                const counterInfo = guildData.counter;

                let memberInfo = counterInfo.filter(info => info.type === "member");

                if (memberInfo[0].id) {
                    const channel = guild.channels.cache.get(memberInfo[0].id);
                    if (!channel) {
                        try {
                            console.log('[INVALID COUNTER CHANNEL] Channel invalid deleting in db')
                            guildData.config.memberCount = {name: 'Non définie', type: `${memberInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                memberCount: {
                                    name: 'Non définie',
                                    type: `${memberInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})

                        } catch (err) {
                            console.log('[Member count error] Counter error mysql');
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return console.log('[Try editing channel] Try to edit a channel but not manageable');
                    if (channel.name !== `${memberInfo[0].name} ${guild.memberCount.toLocaleString()}`) {
                        await channel.setName(`${memberInfo[0].name} ${guild.memberCount.toLocaleString()}`, `MemberCount`);
                    }
                }

                let botInfo = counterInfo.filter(info => info.type === "bot")
                if (botInfo[0].id) {
                    const channel = guild.channels.cache.get(botInfo[0].id);
                    if (!channel) {
                        try {
                            console.log('[INVALID COUNTER CHANNEL] Channel invalid deleting in db')
                            guildData.config.botCount = {name: 'Non définie', type: `${botInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                botCount: {
                                    name: 'Non définie',
                                    type: `${botInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})

                        } catch (err) {
                            console.log('[Bot count error] Counter error mysql');
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return

                    if (channel.name !== `${botInfo[0].name} ${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}`) {
                        await channel.setName(`${botInfo[0].name} ${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}`, 'Bot count')

                    }
                }


                let voiceInfo = counterInfo.filter(info => info.type === "voice")
                if (voiceInfo[0].id) {
                    let count = 0
                    const channel = guild.channels.cache.get(voiceInfo[0].id);
                    if (!channel) {
                        try {
                            console.log('[INVALID COUNTER CHANNEL] Channel invalid deleting in db')
                            guildData.config.voiceCount = {name: 'Non définie', type: `${voiceInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                voiceCount: {
                                    name: 'Non définie',
                                    type: `${voiceInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})

                        } catch (err) {
                            console.log('[Voice count error] Counter error mysql');
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return
                    const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
                    for (const [, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.user.bot).size;
                    if (channel.name !== `${voiceInfo[0].name} ${count}`) {
                        await channel.setName(`${voiceInfo[0].name} ${count}`, 'Voice count')
                    }


                }
                let onlineInfo = counterInfo.filter(info => info.type === "online")
                if (onlineInfo[0].id) {

                    const channel = guild.channels.cache.get(onlineInfo[0].id);
                    if (!channel) {
                        try {
                            console.log('[INVALID COUNTER CHANNEL] Channel invalid deleting in db')
                            guildData.config.onlineCount = {name: 'Non définie', type: `${onlineInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                onlineCount: {
                                    name: 'Non définie',
                                    type: `${onlineInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})

                        } catch (err) {
                            console.log('[Online count error] Counter error mysql');
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return
                    if (channel.name !== `${onlineInfo[0].name} ${guild.members.cache.filter(member => member.presence?.status === "dnd" || member.presence?.status === "idle" || member.presence?.status === "online").size}`) {
                        await channel.setName(`${onlineInfo[0].name} ${guild.members.cache.filter(member => member.presence?.status === "dnd" || member.presence?.status === "idle" || member.presence?.status === "online").size}`, 'OnlineCount')
                    }


                }
                let offlineInfo = counterInfo.filter(info => info.type === "offline")
                if (offlineInfo[0].id) {

                    const channel = guild.channels.cache.get(offlineInfo[0].id);
                    if (!channel) {
                        try {
                            console.log('[INVALID COUNTER CHANNEL] Channel invalid deleting in db')
                            guildData.config.offlineCount = {name: 'Non définie', type: `${offlineInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                offlineCount: {
                                    name: 'Non définie',
                                    type: `${offlineInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})
                        } catch (err) {
                            console.log('[Offline count error] Counter error mysql');
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return

                    if (channel.name !== `${offlineInfo[0].name} ${guild.members.cache.filter(member => !member.presence || member.presence.status === "offline").size}`) {
                        await channel.setName(`${offlineInfo[0].name} ${guild.members.cache.filter(member => !member.presence || member.presence.status === "offline").size}`, 'OfflineCount')

                    }


                }
                let channelInfo = counterInfo.filter(info => info.type === "channel")
                if (channelInfo[0].id) {

                    const channel = guild.channels.cache.get(channelInfo[0].id);
                    if (!channel) {
                        try {
                            console.log('[INVALID COUNTER CHANNEL] Channel invalid deleting in db')
                            guildData.config.channelCount = {name: 'Non définie', type: `${channelInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                channelCount: {
                                    name: 'Non définie',
                                    type: `${channelInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})
                        } catch (err) {
                            console.log('[Channel count error] Counter error mysql');
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return
                    if (channel.name !== `${channelInfo[0].name} ${guild.channels.cache.size}`) {
                        await channel.setName(`${channelInfo[0].name} ${guild.channels.cache.size}`, 'ChannelCount')

                    }


                }
                let roleInfo = counterInfo.filter(info => info.type === "role")
                if (roleInfo[0].id) {

                    const channel = guild.channels.cache.get(roleInfo[0].id);
                    if (!channel) {
                        try {
                            console.log('[INVALID COUNTER CHANNEL] Channel invalid deleting in db')
                            guildData.config.roleCount = {name: 'Non définie', type: `${roleInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                roleCount: {
                                    name: 'Non définie',
                                    type: `${roleInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})
                        } catch (err) {
                            console.log('[Role count error] Counter error mysql');
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return

                    if (channel.name !== `${roleInfo[0].name} ${guild.roles.cache.size}`) {
                        await channel.setName(`${roleInfo[0].name} ${guild.roles.cache.size}`, 'Role Count')

                    }


                }
                let boosterInfo = counterInfo.filter(info => info.type === "booster")
                if (boosterInfo[0].id) {

                    const channel = guild.channels.cache.get(boosterInfo[0].id);
                    if (!channel) {
                        try {
                            console.log('[INVALID COUNTER CHANNEL] Channel invalid deleting in db')
                            guildData.config.boosterCount = {name: 'Non définie', type: `${boosterInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                boosterCount: {
                                    name: 'Non définie',
                                    type: `${boosterInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})
                        } catch (err) {
                            console.log('[Boost count error] Counter error mysql');
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return

                    if (channel.name !== `${boosterInfo[0].name} ${guild.premiumSubscriptionCount || '0'}`) {
                        await channel.setName(`${boosterInfo[0].name} ${guild.premiumSubscriptionCount || '0'}`, 'Booster Count')

                    }

                }
            })


        })
        setTimeout(async () => {
            await new Coins(client).init()

        }, 5000)

    }
}
