
const guildMemberRole = new Map();

const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'lock',
            description: 'Lock one or multiple channels | Fermer un ou plusieurs salons',
            usage: 'lock <on / off / all> <on / off>',
            category: 'moderation',
            userPermissions: [PermissionFlagsBits.ManageChannels],
            clientPermissions: [PermissionFlagsBits.ManageChannels],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang)

        let isSetup = message.guild.setup
        if (!isSetup) return message.channel.send(lang.error.noSetup)
        const lockAllOn = args[0] === 'all' && args[1] === "on";
        const lockAllOff = args[0] === 'all' && args[1] === "off";
        const on = args[0] === 'on';
        const off = args[0] === 'off';
        const color = guildData.color

        const channels = message.guild.channels.cache.filter(ch => ch.type !== ChannelType.GuildCategory)
        const ch = message.channel

        if (!args[0]) {
            const hEmbed = new EmbedBuilder()
                .setAuthor({ name: `Informations lock`, iconURL: `https://images-ext-2.discordapp.net/external/1jym0uCwurjteTPUodKOyFbBriTlwJyS56xk9hDjo2s/https/images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%253Fwidth%253D588%2526height%253D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg` })
                .setDescription(`[\`lock on\`](https://discord.gg/h69YZHB7Nh), [\`lock off\`](https://discord.gg/h69YZHB7Nh), [\`lock all on\`](https://discord.gg/h69YZHB7Nh), [\`lock all off\`](https://discord.gg/h69YZHB7Nh)`)
                .setFooter({ text: `Informations lock`, iconURL: `https://images-ext-2.discordapp.net/external/1jym0uCwurjteTPUodKOyFbBriTlwJyS56xk9hDjo2s/https/images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%253Fwidth%253D588%2526height%253D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg` })
                .setColor(color)
                .setTimestamp();
            return message.channel.send({ embeds: [hEmbed] })
        }
        const memberRole = message.guild.roles.cache.get(guildData.config.memberRole);
        if (lockAllOn) {
            channels.forEach(channel => {
                channel.permissionOverwrites.edit(memberRole, {
                    SendMessages: false
                })

            })
            message.channel.send(lang.lock.successLockAll)


        } else if (lockAllOff) {
            channels.forEach(channel => {
                channel.permissionOverwrites.edit(memberRole, {
                    SendMessages: true
                })

            })
            message.channel.send(lang.lock.successOpenAll)

        } else if (on) {
            ch.permissionOverwrites.edit(memberRole, {
                SendMessages: false
            }).then(() => {
                message.channel.send(lang.lock.successLock)
            })
        } else if (off) {
            ch.permissionOverwrites.edit(memberRole, {
                SendMessages: true
            }).then(() => {
                message.channel.send(lang.lock.successOpen)
            })
        }
    }
}
