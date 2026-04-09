const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class Help extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Show the command | Affiche les commandes',
            category: 'everyone',
            usage: 'help [commandName]',
            aliases: ['h'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const p = guildData.prefix;

        const categories = [
            { key: ['guildowner', 'owner'], name: 'Owner', icon: '👑', cmds: ['setlang', 'owner', 'blacklist', 'permconfig', 'perm'] },
            { key: ['antiraid', 'ar'], name: 'Anti-Raid', icon: '🛡️', cmds: ['antiraid', 'setlogs', 'wl'] },
            { key: ['mod', 'moderation'], name: 'Modération', icon: '⚔️', cmds: ['ban', 'kick', 'mute', 'tempmute', 'warn', 'clear', 'lock', 'nuke', 'unban', 'say', 'dero', 'derank', 'setprefix', 'setcolor', 'setup'] },
            { key: ['misc', 'autres'], name: 'Utilitaires', icon: '🔧', cmds: ['massrole', 'role', 'webhook', 'counter', 'embed', 'reactrole', 'tempvoc', 'addemoji', 'rmemoji', 'soutien'] },
            { key: ['backup'], name: 'Backup', icon: '💾', cmds: ['backup create', 'backup delete', 'backup list', 'backup info'] },
            { key: ['invite'], name: 'Invitations', icon: '📨', cmds: ['invite', 'topinvite', 'addinvite', 'rminvite', 'clearinvite'] },
            { key: ['coins', 'economy'], name: 'Économie', icon: '💰', cmds: ['coins', 'buy', 'shop', 'shop-settings', 'inventory', 'leaderboard', 'pay'] },
            { key: ['music', 'musique'], name: 'Musique', icon: '🎵', cmds: ['play', 'skip', 'stop', 'queue', 'nowplaying', 'volume', 'pause', 'resume', 'search', 'lyrics', 'filter', 'loop', 'autoplay', 'shuffle', 'playlist', 'myplaylist'] },
            { key: ['fun'], name: 'Fun', icon: '🎮', cmds: ['8ball', 'gay', 'meme'] },
            { key: ['general', 'info'], name: 'Général', icon: '📋', cmds: ['help', 'ping', 'botinfo', 'serverinfo', 'userinfo', 'authorinfo', 'support', 'invitebot', 'snipe', 'pic', 'vocal'] },
        ];

        if (!args[0]) {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
                .setDescription(
                    `Bienvenue sur **${client.user.username}** !\n` +
                    `Prefix : \`${p}\`\n` +
                    `\u200b`
                );

            const left = categories.slice(0, 5);
            const right = categories.slice(5);

            embed.addFields(
                { name: '\u200b', value: left.map(c => `${c.icon} **${c.name}**\n\`${p}help ${c.key[0]}\``).join('\n\n'), inline: true },
                { name: '\u200b', value: right.map(c => `${c.icon} **${c.name}**\n\`${p}help ${c.key[0]}\``).join('\n\n'), inline: true },
            );

            embed.addFields({ name: '\u200b', value: `\`${p}help <commande>\` — détail d'une commande\n\`${p}help commands\` — liste complète\n\n[Serveur support](https://discord.gg/TfwGcCjyfp)` });

            return message.reply({ embeds: [embed] });
        }

        if (args[0] === 'commands') {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Toutes les commandes', iconURL: client.user.displayAvatarURL() });

            for (const cat of categories) {
                embed.addFields({
                    name: `${cat.icon}  ${cat.name}`,
                    value: cat.cmds.map(c => `\`${c}\``).join('  ') + '\n\u200b'
                });
            }

            return message.reply({ embeds: [embed] });
        }

        const cat = categories.find(c => c.key.includes(args[0].toLowerCase()));
        if (cat) {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: cat.name, iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    cat.cmds.map(c => `\`${p}${c}\``).join('\n') + '\n\u200b'
                );
            return message.reply({ embeds: [embed] });
        }

        const cmd = client.commands.get(args[0].toLowerCase().normalize()) || client.aliases.get(args[0].toLowerCase().normalize());
        if (!cmd) return message.reply(lang.help.noCommand(args[0])).then(m => setTimeout(() => m.delete().catch(() => {}), 4000));

        const embed = new Embed(client, guildData)
            .setAuthor({ name: cmd.name, iconURL: client.user.displayAvatarURL() })
            .setDescription(cmd.description + '\n\u200b')
            .addFields(
                { name: 'Utilisation', value: `\`${p}${cmd.usage || cmd.name}\``, inline: true },
                { name: 'Aliases', value: cmd.aliases.length ? cmd.aliases.map(a => `\`${a}\``).join(' ') : '*Aucun*', inline: true },
                { name: 'Cooldown', value: `\`${cmd.cooldown}s\``, inline: true },
            );
        message.reply({ embeds: [embed] });
    }
};
