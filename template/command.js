const { PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');

module.exports = class NomCommande extends Command {
    constructor() {
        super({
            name: '',
            description: '',
            usage: '',
            category: '',
            aliases: [],
            userPermissions: [PermissionFlagsBits.SendMessages],
            clientPermissions: [PermissionFlagsBits.SendMessages],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);
        const color = guildData.color;
    }
};
