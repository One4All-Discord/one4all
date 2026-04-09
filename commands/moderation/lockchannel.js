const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = class Lock extends Command {
    constructor() {
        super({
            name: 'lock',
            description: 'Lock one or multiple channels',
            usage: 'lock <on / off / all on / all off>',
            category: 'moderation',
            userPermissions: [PermissionFlagsBits.ManageChannels],
            clientPermissions: [PermissionFlagsBits.ManageChannels],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);

        let isSetup = message.guild.setup;
        if (!isSetup) return message.reply(lang.error.noSetup);

        if (!args[0]) {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Lock', iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    `\`lock on\` — Verrouiller ce salon\n` +
                    `\`lock off\` — Déverrouiller ce salon\n\u200b\n` +
                    `\`lock all on\` — Verrouiller tout le serveur\n` +
                    `\`lock all off\` — Déverrouiller tout le serveur`
                );
            return message.reply({ embeds: [embed] });
        }

        const memberRole = message.guild.roles.cache.get(guildData.config.memberRole);
        const channels = message.guild.channels.cache.filter(ch => ch.type !== ChannelType.GuildCategory);

        if (args[0] === 'all' && args[1] === 'on') {
            channels.forEach(ch => ch.permissionOverwrites.edit(memberRole, { SendMessages: false }));
            message.reply(lang.lock.successLockAll);
        } else if (args[0] === 'all' && args[1] === 'off') {
            channels.forEach(ch => ch.permissionOverwrites.edit(memberRole, { SendMessages: true }));
            message.reply(lang.lock.successOpenAll);
        } else if (args[0] === 'on') {
            message.channel.permissionOverwrites.edit(memberRole, { SendMessages: false }).then(() => message.reply(lang.lock.successLock));
        } else if (args[0] === 'off') {
            message.channel.permissionOverwrites.edit(memberRole, { SendMessages: true }).then(() => message.reply(lang.lock.successOpen));
        }
    }
};
