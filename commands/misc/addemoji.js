const { PermissionFlagsBits, Util } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'addemoji',
            description: 'Add a emoji | Ajouter un emoji',
            usage: 'addemoji <emoji> <name>',
            category: 'misc',
            aliases: ['create', 'emojicreate'],
            userPermissions: [PermissionFlagsBits.ManageGuild],
            clientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);


        const color = guildData.color
        const lang = client.lang(guildData.lang)
        const emoji = args[0];
        let custom = Util.parseEmoji(emoji);

        if (!emoji) {
            return message.reply(lang.addemoji.missingUrl);
        }
        let name = args[1] ? args[1].replace(/[^a-z0-9]/gi, "") : null;
        if (!custom.id && !name) {
            return message.reply(lang.addemoji.missingName);
        }
        if (name && (name.length < 2 || name > 32)) {
            return message.reply(lang.addemoji.invalidName);
        }
        if(!name) name = custom.id

        let link = args[0]
        if (custom.id) {
            link = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`


        }
        message.guild.emojis.create(link, name, {reason: `emoji add par ${message.author.username}`}).then(() => {
            message.reply(lang.addemoji.success(name))
            Logger.log(`${Logger.setColor('teal')}${message.author.username} a ajouté un emoji`, 'Success add emoji')
        })
    }
}

