const logsChannelId = new Map();
const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'ban',
            description: 'Ban a user from the server | Bannir un membre du serveur',
            usage: 'ban <mention / id> [reason]',
            category: 'moderation',
            userPermissions: [PermissionFlagsBits.BanMembers],
            clientPermissions: [PermissionFlagsBits.BanMembers],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang)
        const color = guildData.color

        const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(async err => {
            return await message.channel.send(lang.ban.noBan).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        })
        if (user.id === message.author.id) {
            return await message.channel.send(lang.ban.errorBanSelf).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        }

        let reason = args.slice(1).join(" ");
        if (!reason) {
            reason = `Ban par ${message.author.username}`
        }

        const member = await message.guild.members.fetch(user.id).catch(() => {
        });
        if (member) {
            const memberPosition = member.roles.highest.position;
            const moderationPosition = message.member.roles.highest.position;
            if (message.guild.ownerId !== message.author.id && !(moderationPosition > memberPosition) && !client.isOwner(message.author.id)) {
                return message.channel.send(lang.ban.errorRl(user)).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
            }
            if (!member.bannable) {
                return message.channel.send(lang.ban.errorRl(user)).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
            }
        }

        await user.send(lang.ban.dm(message.guild.name, message.author.username)).catch(() => {});


        message.guild.members.ban(user, {reason}).then(async () => {
            const {modLog} = guildData.logs;
            const channel = message.guild.channels.cache.get(modLog);
            const guild = message.guild;

            let {logs} = client.lang(guildData.lang)
            const color = guildData.color;

            if (channel && !channel.deleted) {
                channel.send({ embeds: [logs.targetExecutorLogs("ban", message.member, user, color)] })
            }
            const antiraidConfig = guild.antiraid;
            let {antiraidLog} = guildData.logs;
            const isOn = antiraidConfig.enable["antiMassBan"];
            if (!isOn) return;
            if (guild.ownerId === message.author.id) return;
            let isGuildOwner = guildData.isGuildOwner(message.author.id);
            let isBotOwner = client.isOwner(message.author.id);


            let isWlBypass = antiraidConfig.bypass["antiMassBan"];
            if (isWlBypass) var isWl = guild.isGuildWl(message.author.id);
            if (isGuildOwner || isBotOwner || isWlBypass && isWl) return;


            if (isWlBypass && !isWl || !isWlBypass) {
                const banLimit = antiraidConfig.config["antiMassBanLimit"]
                const logsChannel = guild.channels.cache.get(antiraidLog)
                if (!guild.antiraidLimit.has(message.author.id)) {
                    await guild.updateAntiraidLimit(message.author.id, 0, 1, 0);

                }
                const {deco, ban, kick} = guild.antiraidLimit.get(message.author.id)
                if (ban < banLimit) {
                    await guild.updateAntiraidLimit(message.author.id, deco, ban + 1, kick);
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send(logs.targetExecutorLogs("ban", message.member, member, color, `${ban + 1 === banLimit ? `Aucun ban restant` : `${ban + 1}/${banLimit}`} before sanction`))
                    }
                } else {
                    let sanction = antiraidConfig.config["antiMassBan"];


                    if (message.member.roles.highest.comparePositionTo(message.guild.members.me.roles.highest) <= 0) {
                        if (sanction === 'ban') {
                            await guild.members.ban(message.author.id, {reason: 'OneForAll - Type : antiMassBan'})
                        } else if (sanction === 'kick') {
                            guild.members.cache.get(message.author.id).kick(
                                `OneForAll - Type: antiMassBan `
                            )
                        } else if (sanction === 'unrank') {
                            let roles = []
                            await guild.members.cache.get(message.author.id).roles.cache
                                .map(role => roles.push(role.id))

                            await guild.members.cache.get(message.author.id).roles.remove(roles, `OneForAll - Type: antiMassBan`)

                        }
                        if (logsChannel && !logsChannel.deleted) {
                            logsChannel.send(logs.targetExecutorLogs("ban", message.member, user, color, sanction))
                        }
                        await guild.updateAntiraidLimit(message.author.id, deco, 0, kick)

                    } else {
                        if (logsChannel && !logsChannel.deleted) {
                            logsChannel.send(logs.targetExecutorLogs("ban", message.member, user, color, "Je n'ai pas assé de permissions"))
                        }
                        await guild.updateAntiraidLimit(message.author.id, deco, 0, kick)

                    }
                }
                message.channel.send(lang.ban.success(user));
            }
        })

            .catch((err) => {
                console.log('err', err)
                if (err.toString().includes('Missing Permission')) return message.channel.send(lang.error.MissingPermission)
                message.channel.send(lang.ban.error(user))
            })
    }
};
