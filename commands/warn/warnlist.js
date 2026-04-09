const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class WarnList extends Command {
    constructor() {
        super({
            name: 'warnlist',
            description: "Show the server warns or of a specif member | Affiche les warns du serveur ou d'un membre en particulier",
            category: 'warn',
            usage: 'warnlist [member/id]',
            aliases: ['warn-list', 'serverwarn'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            userPermissions: [PermissionFlagsBits.BanMembers],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const warnedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (warnedMember) {
            const warnsMember = client.getMemberData(message.guild.id, warnedMember.user.id || warnedMember.id).warns;
            const embed = new Embed(client, guildData)
                .setAuthor({ name: `⚠️  Warns de ${warnedMember.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    warnsMember.length < 1
                        ? lang.warn.noWarn
                        : warnsMember.map((warn, i) => `▸ **#${i + 1}** — ${warn}`).join('\n')
                )
                .setRequestedBy(message.author);
            return message.reply({ embeds: [embed] });
        }

        const allWarns = await message.guild.allWarns();
        if (!allWarns) return message.reply(lang.warn.noGuildWarn);

        let tdata = await message.reply(lang.loading);
        let p0 = 0, p1 = 10, page = 1;

        const embed = new Embed(client, guildData)
            .setAuthor({ name: `⚠️  Warns — ${message.guild.name}`, iconURL: client.user.displayAvatarURL() });

        const buildDesc = (start, end, pg) => allWarns
            .map((info, i) => `\`${i + 1}\` ▸ <@${info.userId}> — ${info.warn.slice(0, 30)}`)
            .slice(start, end)
            .join('\n') + `\n\nPage **${pg}** / **${Math.ceil(allWarns.length / 10)}**`;

        embed.setDescription(buildDesc(p0, p1, page));

        if (allWarns.length > 10) {
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
                if (p1 > allWarns.length + 10) return;
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
    }
};
