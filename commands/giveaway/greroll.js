const { PermissionFlagsBits } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'greroll',
            description: 'Reroll giveaways',
            usage: 'greroll',
            category: 'giveaway',
            aliases: ['grl', 'gredo'],
            userPermissions: [PermissionFlagsBits.SendMessages],
            clientPermissions: [PermissionFlagsBits.Administrator],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const color = guildData.color
        const msgId = args[0];
        if (!msgId) return message.reply(`▫️ \`ERREUR\` Veuillez spécifiez l'id du message de giveaway !`)

        let giveaway = client.giveaways.giveaways.find((g) => g.prize === args.join(" ")) || client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if (!giveaway) return message.reply("Je ne trouve pas de giveaway avec cette ID/nom");

        client.giveaway.reroll(giveaway.messageID)
            .then(() => {
                message.reply('Le giveaway a été **__reroll__**')
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway avec l'ID ${giveaway.messageID} n'est pas terminé `)) {
                    message.reply("Ce giveaway n'est pas encore terminé")
                } else {
                    console.error(e);
                    message.reply('Oupsi, une erreur est survenue')
                }
            })

    }
};

