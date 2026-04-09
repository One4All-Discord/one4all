const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'say',
            description: 'The bot can say your message | Le bot dit votre message',
            usage: 'say <message>',
            category: 'owners',
            userPermissions: [PermissionFlagsBits.Administrator],
            cooldown: 6
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const color = guildData.color
        const lang = client.lang(guildData.lang)
        const toSay = args.slice(0).join(' ')
        await message.delete()
        if (toSay.length < 1) return message.reply(lang.say.cantSendEmptyMsg).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
        message.reply(toSay)
    }
}
