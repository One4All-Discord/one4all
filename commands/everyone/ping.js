const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
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

        const msg = await message.channel.send({ embeds: [new Embed(client, guildData).setDescription('◈ Pinging...')] });
        const ping = msg.createdTimestamp - message.createdTimestamp;
        const embed = new Embed(client, guildData)
            .setDescription(`◈ Latence du bot: \`${ping}\` ms\n◈ Latence API: \`${Math.round(client.ws.ping)}\` ms`)
            .setRequestedBy(message.author);
        msg.edit({ embeds: [embed] });
    }
};
