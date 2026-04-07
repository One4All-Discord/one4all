const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'authorinfo',
            description: 'Information about the author of the bot | Information sur les auteurs du bot',
            category: 'info',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            aliases: ['author', 'createur'],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const lang = client.lang(guildData.lang)
        const embed = new Embed(client, guildData)
            .setDescription(lang.authorinfo.description)
        message.channel.send({ embeds: [embed] })
    }
};


