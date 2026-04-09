const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class PermConfig extends Command {
    constructor() {
        super({
            name: 'permconfig',
            description: 'Manage perm role on the serv | Gerer les perms role sur le serveur',
            category: 'perm',
            usage: 'permconfig <numberOfPerm> <roleId/mention> || permconfig <on/off>',
            aliases: ['permconfig', 'perm-config', 'setup-perm'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            userPermissions: [PermissionFlagsBits.Administrator],
            guildOwnerOnly: true,
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const permToPutCommand = args[0];
        const lang = client.lang(guildData.lang);
        const options = {};

        if (!permToPutCommand) {
            const { perm1, perm2, perm3, perm4, permEnable } = guildData;
            const embed = new Embed(client, guildData)
                .setAuthor({ name: '🔑  Configuration des permissions', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    { name: 'Perm 1', value: !perm1 ? lang.perm.noRole : `<@&${perm1}>`, inline: true },
                    { name: 'Perm 2', value: !perm2 ? lang.perm.noRole : `<@&${perm2}>`, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: 'Perm 3', value: !perm3 ? lang.perm.noRole : `<@&${perm3}>`, inline: true },
                    { name: 'Perm 4', value: !perm4 ? lang.perm.noRole : `<@&${perm4}>`, inline: true },
                    { name: 'Activé', value: permEnable ? '`✅ Oui`' : '`❌ Non`', inline: true },
                )
                .setRequestedBy(message.author);
            return message.reply({ embeds: [embed] });
        }

        if (permToPutCommand !== 'on' && permToPutCommand !== 'off') {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (permToPutCommand !== '1' && permToPutCommand !== '2' && permToPutCommand !== '3' && permToPutCommand !== '4') return message.reply(lang.perm.permNotFound);
            if (!role) return message.reply(lang.perm.noRoleConfig);
            if (permToPutCommand === '1') options.perm1 = role.id;
            else if (permToPutCommand === '2') options.perm2 = role.id;
            else if (permToPutCommand === '3') options.perm3 = role.id;
            else if (permToPutCommand === '4') options.perm4 = role.id;
            options.isOn = guildData.permEnable;
            message.reply(lang.perm.setupPerm(role.name, permToPutCommand));
        } else {
            options.isOn = permToPutCommand === 'on';
            message.reply(lang.perm.enable(permToPutCommand));
        }

        if (!guildData.permSetup) {
            await guildData.createPerms(options.perm1, options.perm2, options.perm3, options.perm4, permToPutCommand === 'on');
        } else {
            await guildData.updatePerms('roles', options);
        }
    }
};
