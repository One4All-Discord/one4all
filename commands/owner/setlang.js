const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setlang',
            description: 'change the language of the bot | Changer la langue du bot',
            usage: 'setlang',
            category: 'owners',
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.SendMessages],
            guildOwnerOnly: true,
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);


        const color = guildData.color
        const lang = client.lang(guildData.lang)
        const msg = await message.reply(lang.loading)

        await msg.react(`🇫🇷`);
        await msg.react("🇬🇧");
        await msg.react("❌");
        const embed = new Embed(client, guildData)
            .setAuthor({ name: lang.setlang.title, iconURL: client.user.displayAvatarURL() })
            .setDescription(lang.setlang.description(guildData.lang))
        const filter = (reaction, user) => ['🇫🇷', '🇬🇧', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        msg.edit({ embeds: [embed] }).then(async (m) => {
            const collector = m.createReactionCollector({ filter: filter, time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === "🇫🇷") {
                    if (guildData.lang === "fr") {
                        return message.reply(lang.setlang.errorSelected)
                    } else {
                        await collector.stop()
                        await msg.delete();
                        guildData.updateLang = 'fr';
                        return message.reply(lang.setlang.success('fr'))
                    }

                } else if (r.emoji.name === "🇬🇧") {
                    if (guildData.lang === "en") {
                        return message.reply(lang.setlang.errorSelected)
                    } else {
                        await collector.stop()
                        await msg.delete();
                        guildData.updateLang = 'en';
                        return message.reply(lang.setlang.success('en'))
                    }
                } else if (r.emoji.name === "❌") {
                    await collector.stop();
                    return await msg.delete();
                }
            });
        })


    }
}
