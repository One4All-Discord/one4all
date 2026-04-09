const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class HelpAll extends Command {
    constructor() {
        super({
            name: 'helpall',
            description: 'Affiche toutes les commandes par catégorie',
            usage: 'helpall',
            category: 'everyone',
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const prefix = guildData.prefix;

        const categories = [
            { emoji: '👑', name: 'Owner', cmds: ['setlang', 'owner add/remove/clear/list', 'blacklist on/off/add/remove/list/clear', 'permconfig', 'perm'] },
            { emoji: '🛡️', name: 'Anti-Raid', cmds: ['antiraid on/off/config/opti', 'antiraid antispam on/off', 'antiraid antilink on/off', 'setlogs', 'wl add/remove/clear/list'] },
            { emoji: '⚔️', name: 'Modération', cmds: ['ban', 'kick', 'mute', 'tempmute', 'unmute', 'warn', 'clear', 'lock on/off', 'lock all on/off', 'nuke', 'unban', 'say', 'dero', 'derank', 'massrole add/remove', 'role add/remove', 'webhook size/delete', 'setcolor', 'setprefix', 'setup'] },
            { emoji: '💾', name: 'Backup', cmds: ['backup create', 'backup delete', 'backup list', 'backup info'] },
            { emoji: '🎁', name: 'Giveaway', cmds: ['gcreate', 'greroll'] },
            { emoji: '🔧', name: 'Utilitaires', cmds: ['embed', 'reactrole', 'counter', 'tempvoc', 'addemoji', 'rmemoji', 'soutien config/count'] },
            { emoji: '💰', name: 'Économie', cmds: ['coins', 'buy', 'shop', 'shop-settings', 'inventory', 'leaderboard', 'pay'] },
            { emoji: '🎵', name: 'Musique', cmds: ['play', 'skip', 'stop', 'queue', 'nowplaying', 'volume', 'pause', 'resume', 'search', 'lyrics', 'filter', 'loop', 'autoplay', 'shuffle', 'playlist', 'myplaylist'] },
            { emoji: '📋', name: 'Général', cmds: ['help', 'ping', 'botinfo', 'serverinfo', 'userinfo', 'authorinfo', 'support', 'invitebot', 'snipe', 'pic', 'vocal', '8ball', 'gay', 'meme'] },
        ];

        const pages = categories.map(cat => {
            return new Embed(client, guildData)
                .setAuthor({ name: `${cat.emoji}  ${cat.name}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(cat.cmds.map(c => `▸ \`${prefix}${c}\``).join('\n'));
        });

        const emojiList = ['⏪', '⏩'];
        let page = 0;

        const updateFooter = (p) => pages[p].setFooter({ text: `Page ${p + 1}/${pages.length} • ${client.user.username}` });

        const curPage = await message.reply({ embeds: [updateFooter(page)] });
        for (const emoji of emojiList) await curPage.react(emoji);

        const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && user.id === message.author.id;
        const collector = curPage.createReactionCollector({ filter, time: 120000 });

        collector.on('collect', (reaction) => {
            reaction.users.remove(message.author).catch(() => {});
            page = reaction.emoji.name === emojiList[0]
                ? (page > 0 ? --page : pages.length - 1)
                : (page + 1 < pages.length ? ++page : 0);
            curPage.edit({ embeds: [updateFooter(page)] });
        });

        collector.on('end', () => curPage.reactions.removeAll().catch(() => {}));
    }
};
