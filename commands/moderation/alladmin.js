const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class AllAdmins extends Command {
    constructor() {
        super({
            name: 'alladmins',
            description: 'Show all members with administator permissions | Afficher tout les membres avec les perm admin',
            usage: 'alladmins',
            category: 'moderation',
            clientPermissions: [PermissionFlagsBits.ManageGuild],
            userPermissions: [PermissionFlagsBits.Administrator],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const tempdata = [];

        message.guild.members.cache.filter(
            (m) => m.permissions.has(PermissionFlagsBits.Administrator)
        ).map(m => tempdata.push(m.user.id));

        if (tempdata.length === 0) {
            const embed = new Embed(client, guildData)
                .setWarning()
                .setAuthor({ name: '🛡️  Administrateurs', iconURL: client.user.displayAvatarURL() })
                .setDescription(lang.alladmins.error);
            return message.reply({ embeds: [embed] });
        }

        try {
            let tdata = await message.reply(lang.loading);
            let p0 = 0, p1 = 10, page = 1;

            const embed = new Embed(client, guildData)
                .setAuthor({ name: `🛡️  Administrateurs — ${tempdata.length}`, iconURL: client.user.displayAvatarURL() });

            const buildDesc = (start, end, pg) => tempdata
                .filter(x => message.guild.members.cache.get(x))
                .map((user, i) => `\`${i + 1}\` ▸ <@${message.guild.members.cache.get(user).user.id}>`)
                .slice(start, end)
                .join('\n') + `\n\nPage **${pg}** / **${Math.ceil(tempdata.length / 10)}**`;

            embed.setDescription(buildDesc(p0, p1, page));

            if (tempdata.length > 10) {
                await tdata.react('⬅');
                await tdata.react('❌');
                await tdata.react('➡');
            }

            tdata.edit({ embeds: [embed] });

            const data_res = tdata.createReactionCollector({ filter: (reaction, user) => user.id === message.author.id, time: 120000 });
            data_res.on('collect', async (reaction) => {
                if (reaction.emoji.name === '⬅') {
                    p0 -= 10; p1 -= 10; page--;
                    if (p0 < 0) return;
                    embed.setDescription(buildDesc(p0, p1, page));
                    tdata.edit({ embeds: [embed] });
                }
                if (reaction.emoji.name === '➡') {
                    p0 += 10; p1 += 10; page++;
                    if (p1 > tempdata.length + 10) return;
                    embed.setDescription(buildDesc(p0, p1, page));
                    tdata.edit({ embeds: [embed] });
                }
                if (reaction.emoji.name === '❌') {
                    data_res.stop();
                    await tdata.reactions.removeAll();
                    return tdata.delete();
                }
                await reaction.users.remove(message.author.id);
            });
        } catch (err) {
            console.log(err);
        }
    }
};
