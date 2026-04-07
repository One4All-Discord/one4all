const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'help',
            description: 'Show the command | Affiche les commandes',
            category: 'everyone',
            usage: 'help [commandName]',
            aliases: ['h'],
            clientPermissions : [PermissionFlagsBits.EmbedLinks],
            cooldown: 4

        });
    }
    async run(client, message,args) {
        const guildData = client.getGuildData(message.guild.id);

        const lang = client.lang(guildData.lang)

        const helpCommand = new Embed(client, guildData)
            .setRequestedBy(message.author)
            .addFields({ name: `✦ 👑 guildOwner`, value: `[\`setlang\`](https://discord.gg/h69YZHB7Nh), [\`owner add\`](https://discord.gg/h69YZHB7Nh), [\`owner remove\`](https://discord.gg/h69YZHB7Nh), [\`owner clear\`](https://discord.gg/h69YZHB7Nh), [\`owner list\`](https://discord.gg/h69YZHB7Nh), [\`blacklist on\`](https://discord.gg/h69YZHB7Nh), [\`blacklist off\`](https://discord.gg/h69YZHB7Nh), [\`blacklist add\`](https://discord.gg/h69YZHB7Nh), [\`blacklist remove\`](https://discord.gg/h69YZHB7Nh), [\`blacklist list\`](https://discord.gg/h69YZHB7Nh), [\`blacklist clear\`](https://discord.gg/h69YZHB7Nh), [\`permconfig\`](https://discord.gg/h69YZHB7Nh), [\`perm\`](https://discord.gg/h69YZHB7Nh)` })
            .addFields({ name: `✦ 🛡️ Anti Raid`, value: `[\`antiraid\`](https://discord.gg/h69YZHB7Nh), [\`antiraid on\`](https://discord.gg/h69YZHB7Nh), [\`antiraid off\`](https://discord.gg/h69YZHB7Nh), [\`antiraid config\`](https://discord.gg/h69YZHB7Nh), [\`antiraid opti\`](https://discord.gg/h69YZHB7Nh), [\`antiraid antispam on\`](https://discord.gg/h69YZHB7Nh), [\`antiraid antispam off\`](https://discord.gg/h69YZHB7Nh), [\`antiraid antilink on\`](https://discord.gg/h69YZHB7Nh), [\`antiraid antilink off\`](https://discord.gg/h69YZHB7Nh), [\`setlogs\`](https://discord.gg/h69YZHB7Nh), [\`wl add\`](https://discord.gg/h69YZHB7Nh), [\`wl remove\`](https://discord.gg/h69YZHB7Nh), [\`wl clear\`](https://discord.gg/h69YZHB7Nh), [\`wl list\`](https://discord.gg/h69YZHB7Nh)` })
            .addFields({ name: `✦ ⚔️ Modération`, value: `[\`soutien config\`](https://discord.gg/h69YZHB7Nh), [\`soutien count\`](https://discord.gg/h69YZHB7Nh), [\`invite config\`](https://discord.gg/h69YZHB7Nh), [\`allbans\`](https://discord.gg/h69YZHB7Nh), [\`alladmins\`](https://discord.gg/h69YZHB7Nh), [\`lock all off\`](https://discord.gg/h69YZHB7Nh), [\`lock all on\`](https://discord.gg/h69YZHB7Nh), [\`lock off\`](https://discord.gg/h69YZHB7Nh), [\`lock on\`](https://discord.gg/h69YZHB7Nh), [\`clear\`](https://discord.gg/h69YZHB7Nh), [\`kick\`](https://discord.gg/h69YZHB7Nh), [\`ban\`](https://discord.gg/h69YZHB7Nh), [\`unban\`](https://discord.gg/h69YZHB7Nh), [\`unban all\`](https://discord.gg/h69YZHB7Nh), [\`say\`](https://discord.gg/h69YZHB7Nh), [\`mutelist\`](https://discord.gg/h69YZHB7Nh), [\`warn clear/list/remove/warnconfig\`](https://discord.gg/h69YZHB7Nh)` })
            .addFields({ name: `✦ ⚔️ Modération 2`, value: `[\`massrole add\`](https://discord.gg/h69YZHB7Nh), [\`massrole remove\`](https://discord.gg/h69YZHB7Nh) [\`role add\`](https://discord.gg/h69YZHB7Nh), [\`role remove\`](https://discord.gg/h69YZHB7Nh), [\`webhook size\`](https://discord.gg/h69YZHB7Nh), [\`webhook delete\`](https://discord.gg/h69YZHB7Nh), [\`nuke\`](https://discord.gg/h69YZHB7Nh), [\`setcolor\`](https://discord.gg/h69YZHB7Nh), [\`setprefix\`](https://discord.gg/h69YZHB7Nh), [\`setup\`](https://discord.gg/h69YZHB7Nh), [\`mute\`](https://discord.gg/h69YZHB7Nh), [\`tempmute\`](https://discord.gg/h69YZHB7Nh), [\`tempban\`](https://discord.gg/h69YZHB7Nh), [\`dero\`](https://discord.gg/h69YZHB7Nh), [\`addemoji\`](https://discord.gg/h69YZHB7Nh), [\`removemoji\`](https://discord.gg/h69YZHB7Nh)` })
            .addFields({ name: `✦ 🏠 Backup`, value: `[\`backup create\`](https://discord.gg/h69YZHB7Nh), [\`backup delete\`](https://discord.gg/h69YZHB7Nh), [\`backup list\`](https://discord.gg/h69YZHB7Nh), [\`backup info\`](https://discord.gg/h69YZHB7Nh)` })
            .addFields({ name: `✦ 📋 Autres`, value: `[\`counter\`](https://discord.gg/h69YZHB7Nh), [\`embed\`](https://discord.gg/h69YZHB7Nh), [\`reactrole\`](https://discord.gg/h69YZHB7Nh), [\`tempvoc\`](https://discord.gg/h69YZHB7Nh), [\`gstart\`](https://discord.gg/h69YZHB7Nh), [\`greroll\`](https://discord.gg/h69YZHB7Nh), [\`invite\`](https://discord.gg/h69YZHB7Nh), [\`addinvite\`](https://discord.gg/h69YZHB7Nh), [\`removeinvite\`](https://discord.gg/h69YZHB7Nh), [\`clearinvite\`](https://discord.gg/h69YZHB7Nh), [\`invite config\`](https://discord.gg/h69YZHB7Nh), [\`topinvite\`](https://discord.gg/h69YZHB7Nh)` })
            .addFields({ name: `✦ 💰 Coins`, value: `[\`buy\`](https://discord.gg/h69YZHB7Nh), [\`coins\`](https://discord.gg/h69YZHB7Nh), [\`inventory\`](https://discord.gg/h69YZHB7Nh), [\`leaderboard\`](https://discord.gg/h69YZHB7Nh), [\`pay\`](https://discord.gg/h69YZHB7Nh), [\`shop-settings\`](https://discord.gg/h69YZHB7Nh)` })
            .addFields({ name: `✦ 🎵 Music`, value: `[\`play\`](https://discord.gg/h69YZHB7Nh), [\`autoplay\`](https://discord.gg/h69YZHB7Nh), [\`lyrics\`](https://discord.gg/h69YZHB7Nh), [\`pause\`](https://discord.gg/h69YZHB7Nh), [\`nowplaying\`](https://discord.gg/h69YZHB7Nh), [\`queue\`](https://discord.gg/h69YZHB7Nh), [\`resume\`](https://discord.gg/h69YZHB7Nh), [\`pause\`](https://discord.gg/h69YZHB7Nh), [\`search\`](https://discord.gg/h69YZHB7Nh), [\`skip\`](https://discord.gg/h69YZHB7Nh), [\`stop\`](https://discord.gg/h69YZHB7Nh), [\`volume\`](https://discord.gg/h69YZHB7Nh), [\`playlist (add/delete/remove/import/create)\`](https://discord.gg/h69YZHB7Nh), [\`myplaylist\`](https://discord.gg/h69YZHB7Nh), [\`filter\`](https://discord.gg/h69YZHB7Nh)` })
            .addFields({ name: `✦ 🌐 Général`, value: `[\`helpall\`](https://discord.gg/h69YZHB7Nh), [\`support\`](https://discord.gg/h69YZHB7Nh), [\`addbot\`](https://discord.gg/h69YZHB7Nh), [\`snipe\`](https://discord.gg/h69YZHB7Nh), [\`pic\`](https://discord.gg/h69YZHB7Nh), [\`vocal\`](https://discord.gg/h69YZHB7Nh), [\`authorinfo\`](https://discord.gg/h69YZHB7Nh), [\`ping\`](https://discord.gg/h69YZHB7Nh), [\`botinfo\`](https://discord.gg/h69YZHB7Nh), [\`serverinfo\`](https://discord.gg/h69YZHB7Nh), [\`userinfo\`](https://discord.gg/h69YZHB7Nh), [\`8ball\`](https://discord.gg/h69YZHB7Nh), [\`gay\`](https://discord.gg/h69YZHB7Nh), [\`meme\`](https://discord.gg/h69YZHB7Nh)` })
        const prefix = guildData.prefix
        if (!args[0]) {
            const filter = (reaction, user) => ['📄'].includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            const embed = new Embed(client, guildData)
                .setTitle(lang.help.titleNoArgs)
                .setDescription(lang.help.information2(prefix))
                .setRequestedBy(message.author)
                .addFields({ name: `◈ Links`, value: `[Support Server](https://discord.gg/h69YZHB7Nh)\n◈ Developer: **KhdDev**` })
            const princMsg = await message.channel.send({ embeds: [embed] }).then(async m => {
                await m.react('📄')
                const collector = m.createReactionCollector({ filter, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === '📄') {
                        message.channel.send({ embeds: [helpCommand] }).then(() => {
                            m.reactions.removeAll()
                            collector.stop()
                        })
                    }
                })
            })

        }
        if (args[0] === 'commands') {

            message.channel.send({ embeds: [helpCommand] })
        }
        if (args[0] !== 'commands' && args[0]) {
            // Category shortcuts
            const categories = {
                'guildowner': { emoji: '👑', name: 'guildOwner', field: helpCommand.data.fields[0] },
                'owner': { emoji: '👑', name: 'guildOwner', field: helpCommand.data.fields[0] },
                'antiraid': { emoji: '🛡️', name: 'Anti Raid', field: helpCommand.data.fields[1] },
                'ar': { emoji: '🛡️', name: 'Anti Raid', field: helpCommand.data.fields[1] },
                'mod': { emoji: '⚔️', name: 'Modération', field: helpCommand.data.fields[2] },
                'moderation': { emoji: '⚔️', name: 'Modération', field: helpCommand.data.fields[2] },
                'mod2': { emoji: '⚔️', name: 'Modération 2', field: helpCommand.data.fields[3] },
                'backup': { emoji: '🏠', name: 'Backup', field: helpCommand.data.fields[4] },
                'autres': { emoji: '📋', name: 'Autres', field: helpCommand.data.fields[5] },
                'misc': { emoji: '📋', name: 'Autres', field: helpCommand.data.fields[5] },
                'coins': { emoji: '💰', name: 'Coins', field: helpCommand.data.fields[6] },
                'economy': { emoji: '💰', name: 'Coins', field: helpCommand.data.fields[6] },
                'music': { emoji: '🎵', name: 'Music', field: helpCommand.data.fields[7] },
                'musique': { emoji: '🎵', name: 'Music', field: helpCommand.data.fields[7] },
                'general': { emoji: '🌐', name: 'Général', field: helpCommand.data.fields[8] },
            };

            const cat = categories[args[0].toLowerCase()];
            if (cat) {
                const embed = new Embed(client, guildData)
                    .setTitle(`${cat.emoji} ${cat.name}`)
                    .setDescription(cat.field.value)
                    .setRequestedBy(message.author);
                return message.channel.send({ embeds: [embed] });
            }

            // Command lookup
            const cmd = await client.commands.get(args[0].toLowerCase().normalize()) || await client.aliases.get(args[0].toLocaleLowerCase().normalize());

            if (!cmd) return message.channel.send(lang.help.noCommand(args[0])).then((mp) => setTimeout(() => mp.delete().catch(() => {}), 4000))
            const embed = new Embed(client, guildData)
                .setTitle(`${cmd.name} command`)
                .setDescription(lang.help.requiredOrNot)
                .setRequestedBy(message.author)
                .addFields({ name: '◈ Aliases', value: cmd.aliases.length < 1 ? lang.help.noAliases : cmd.aliases.join(', '), inline: true })
                .addFields({ name: '◈ Cooldown', value: `${cmd.cooldown}s`, inline: true })
                .addFields({ name: '◈ Catégorie', value: cmd.category, inline: true })
                .addFields({ name: '◈ Description', value: cmd.description })
                .addFields({ name: '◈ Usage', value: cmd.usage === '' ? lang.help.noUsage : `${prefix}${cmd.usage}`, inline: true })
                .addFields({ name: '◈ Permissions Bot', value: `${cmd.clientPermissions}` })
                .addFields({ name: '◈ Permissions User', value: `${cmd.userPermissions}`, inline: true })
            message.channel.send({ embeds: [embed] })
        }
    }
};
