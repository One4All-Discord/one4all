const Embed = require('../../structures/Embed');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'helpall',
            description: 'Affiche toutes les commandes',
            usage: 'helpall',
            category: 'everyone',
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);


        const lang = client.lang(guildData.lang)

        if (!message.guild) return;
        let embed2 = new Embed(client, guildData)
            .setAuthor({ name: '👑 ' + lang.helpall.botOwner })
            .setDescription('\`setlang\`\n\`owner add\`\n\`owner remove\`\n\`owner clear\`\n\`owner list\`\n\`setname\`\n\`setavatar\`\n\`setactivity\`\n\`blacklist add\`\n\`blacklist remove\`\n\`blacklist list\`\n\`blacklist on\`\n\`blacklist off\`')
        //message.channel.send({ embeds: [embed2] })
        let embed3 = new Embed(client, guildData)
            .setAuthor({ name: '⚔️ ' + lang.helpall.moderation })
            .setDescription('\`soutien config\`\n\`soutien count\`\n\`invite config\`\n\`allbans\`\n\`alladmins\`\n\`lock all off\`\n\`lock all on\`\n\`lock off\`\n\`lock on\`\n\`clear\`\n\`kick\`\n\`ban\`\n\`unban all\`\n\`tempban\`\n\`tempmute\`\n\`unban\`\n\`massrole add\`\n\`massrole remove\`\n\`role add\`\n\`role remove\`\n\`webhook size\`\n\`webhook delete\`\n\`nuke\`\n\`setcolor\`\n\`setprefix\`\n\`setup\`\n\`dero\`')
        let embed4 = new Embed(client, guildData)
            .setAuthor({ name: '🛡️ ' + lang.helpall.antiriraid })
            .setDescription('\`antiraid on\`\n\`antiraid off\`\n\`antiraid config\`\n\`antiraid opti\`\n\`antiraid antispam on\`\n\`antiraid antispam off\`\n\`antiraid antilink on\`n\`antiraid antilink off\`\n\`setlogs\`\n\`wl add\`\n\`wl remove\`\n\`wl clear\`\n\`\wl list\`\n\`addemoji\`\n\`removeemoji\`')
        //message.channel.send({ embeds: [embed4] })
        let embed5 = new Embed(client, guildData)
            .setAuthor({ name: '🎁 ' + lang.helpall.giveaway })
            .setDescription('\`gstart\`\n\`greroll\`')
        let embed6 = new Embed(client, guildData)
            .setAuthor({ name: '🏠 Backup' })
            .setDescription('\`backup create\`\n\`backup delete\`\n\`backup list\`\n\`backup info\`')
        let embed7 = new Embed(client, guildData)
            .setAuthor({ name: '📋 ' + lang.helpall.reactrole })
            .setDescription('\`embed\`\n\`reactrole\`')
        let embed8 = new Embed(client, guildData)
            .setAuthor({ name: '🌐 ' + lang.helpall.general })
            .setDescription('\`support\`\n\`addbot\`\n\`vocal\`\n\`authorinfo\`\n\`pic\`\n\`ping\`\n\`botinfo\`\n\`serverinfo\`\n\`userinfo\`\n\`invite count\`\n\`snipe\`')
        const pages = [
            embed2,
            embed3,
            embed4,
            embed5,
            embed6,
            embed7,
            embed8
        ]

        const emojiList = ["⏪", "⏩"];
        let page = 0;
        const curPage = await message.channel.send({ embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length} • ${client.user.username}` })] });
        for (const emoji of emojiList) await curPage.react(emoji);
        const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && user.id === message.author.id;
        const collector = curPage.createReactionCollector({ filter, time: 120000 });
        collector.on('collect', (reaction) => {
            reaction.users.remove(message.author).catch(() => {});
            if (reaction.emoji.name === emojiList[0]) {
                page = page > 0 ? --page : pages.length - 1;
            } else {
                page = page + 1 < pages.length ? ++page : 0;
            }
            curPage.edit({ embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length} • ${client.user.username}` })] });
        });
        collector.on('end', () => {
            curPage.reactions.removeAll().catch(() => {});
        });
    }
}
