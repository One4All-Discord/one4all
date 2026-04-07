const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'unban',
            description: 'Unban a user | Unban un user',
            usage: 'unban < mention / id >',
            category: 'moderation',
            tags: ['guildOnly'],
            clientPermissions: [PermissionFlagsBits.ManageGuild],
            userPermissions: [PermissionFlagsBits.BanMembers],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang)
        const color = guildData.color
        if (args[0] === 'all') {
            const bans = await message.guild.bans.fetch();
            if (bans.size < 1) return message.channel.send(lang.unban.noUnBanAll).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            bans.forEach(ban => {
                message.guild.members.unban(ban.user.id, `Unban all par ${message.author.username}`)
            })


        } else {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(async err => {
                return await message.channel.send(lang.unban.noMember).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
            })
            if (user.id === message.author.id) {
                return await message.channel.send(lang.unban.unbanSelf).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
            }
            const banned = await message.guild.bans.fetch();
            if (!banned.has(user.id)) {
                return message.channel.send(lang.unban.notBan(user)).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            }

            let reason = args.slice(1).join(" ");
            if (!reason) {
                reason = `Unban par ${message.author.username}`
            }
            message.guild.members.unban(user.id, reason).then(() => {
                message.channel.send(lang.unban.success(user))
            })

        }


    }
};
