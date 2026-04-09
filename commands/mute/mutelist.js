const prettyMilliseconds = require('pretty-ms');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class MuteList extends Command {
    constructor() {
        super({
            name: 'mutelist',
            description: 'Show the tempmute member of the server | Afficher la liste des membres tempmute du serveur',
            usage: 'mutelist',
            category: 'moderation',
            userPermissions: [PermissionFlagsBits.MuteMembers],
            clientPermissions: [PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const mutedData = [];
        const lang = client.lang(guildData.lang);
        let now = Date.now();
        const { muted } = guildData;

        if (muted.size !== 0) {
            for (const [id, expireAt] of muted) {
                let timeLeft = expireAt;
                if (expireAt !== 'lifetime') timeLeft = prettyMilliseconds(expireAt.getTime() - now);
                mutedData.push(`▸ <@${id}> — \`${timeLeft}\``);
            }
        } else {
            mutedData.push('*Aucun membre mute*');
        }

        try {
            let tdata = await message.reply(lang.loading);
            let p0 = 0, p1 = 10, page = 1;

            const embed = new Embed(client, guildData)
                .setAuthor({ name: '🔇  Membres mutes', iconURL: client.user.displayAvatarURL() });

            const buildDesc = (start, end, pg) => mutedData
                .slice(start, end)
                .join('\n') + `\n\nPage **${pg}** / **${Math.ceil(mutedData.length / 10)}**`;

            embed.setDescription(buildDesc(p0, p1, page));

            if (mutedData.length > 10) {
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
                    if (p1 > mutedData.length + 10) return;
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
