const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class Ping extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Get the latency and ping of the bot',
            usage: 'ping',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            category: 'everyone',
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const msg = await message.reply({ embeds: [new Embed(client, guildData).setDescription('Calcul en cours...')] });
        const ping = msg.createdTimestamp - message.createdTimestamp;

        const embed = new Embed(client, guildData)
            .setAuthor({ name: 'Pong !', iconURL: client.user.displayAvatarURL() })
            .addFields(
                { name: 'Latence', value: `\`${ping}ms\``, inline: true },
                { name: 'API Discord', value: `\`${Math.round(client.ws.ping)}ms\``, inline: true },
            );
        msg.edit({ embeds: [embed] });
    }
};
