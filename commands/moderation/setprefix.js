
const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setprefix',
            description: 'Change the prefix | Changer le prefix',
            usage: 'setprefix <prefix>',
            category: 'moderation',
            tags: ['guildOnly'],
            clientPermissions: [PermissionFlagsBits.SendMessages],
            guildOwnerOnly: true,
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang)


        let regex = /^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1}$/igm;
        let isValid = regex.test(args[0]);
        if (!isValid) return message.channel.send(lang.setprefix.errorNoValid)

        const [cmdName, newPrefix] = message.content.split(" ");
        if (newPrefix) {
            try {
                guildData.updatePrefix = newPrefix
                message.channel.send(lang.setprefix.success(newPrefix));
            } catch (err) {
                console.log(err);
                message.channel.send(lang.setprefix.errorSql(newPrefix));
            }
        } else {
            message.channel.send(lang.setprefix.errorNoArgs);
        }
    }
}
