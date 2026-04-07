
const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'dero',
            description: "Fix back the derogation of channels when someone raid | Remet les dérogations des salons quand quelqu'un raid",
            usage: 'dero',
            category: 'moderation',
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.ManageChannels],
            guildOwnerOnly: true,
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.getGuildData(message.guild.id);
        const color = guildData.color
        const lang = client.lang(guildData.lang)
        let success;



        if (args[0].toLowerCase() !== 'off') {
            const channels = message.guild.channels.cache
            channels.forEach(channel => {
                channel.edit({
                    permissionOverwrites: [{
                        id: message.guild.id,
                        deny: 805379089
                    }]
                })

            })
            success = await message.channel.send(lang.dero.success);
            setTimeout(() => {
                success.delete();
            }, 5000)
        } else if (args[0].toLowerCase() === "off") {
            const channels = message.guild.channels.cache
            channels.forEach(channel => {
                channel.edit({
                    permissionOverwrites: [{
                        id: message.guild.id,
                        allow: 'VIEW_CHANNEL'
                    }]
                })

            })
            success = await message.channel.send(lang.dero.success);
            setTimeout(() => {
                success.delete();
            }, 5000)
        }

    }
}
