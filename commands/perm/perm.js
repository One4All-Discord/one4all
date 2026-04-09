const { PermissionFlagsBits } = require('discord.js');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class Perm extends Command {
    constructor() {
        super({
            name: 'perm',
            description: 'Manage perm on the serv | Gerer les perms sur le serveur',
            category: 'perm',
            usage: 'perm <numberOfPerm (1/2/3/4/everyone)> <commandName>',
            aliases: ['setperm'],
            userPermissions: [PermissionFlagsBits.Administrator],
            guildOwnerOnly: true,
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const permToPutCommand = args[0];
        let commandName = args[1];
        const lang = client.lang(guildData.lang);
        if (!guildData.permSetup) return message.reply(lang.perm.noSetup(guildData.prefix));

        const { perm } = message.guild;
        const options = {
            perm1Command: [],
            perm2Command: [],
            perm3Command: [],
            perm4Command: [],
        };

        if (perm.size > 0) {
            for (const [commandName, perms] of perm) {
                if (perms === 'perm1') options.perm1Command.push(commandName);
                else if (perms === 'perm2') options.perm2Command.push(commandName);
                else if (perms === 'perm3') options.perm3Command.push(commandName);
                else if (perms === 'perm4') options.perm4Command.push(commandName);
            }
        }

        if (!args[0]) {
            const formatList = (list) => list.length < 1 ? '*Aucune commande*' : list.map(n => `\`${n}\``).join(' ');
            const embed = new Embed(client, guildData)
                .setAuthor({ name: '🔑  Permissions — Commandes', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    { name: 'Perm 1', value: formatList(options.perm1Command), inline: true },
                    { name: 'Perm 2', value: formatList(options.perm2Command), inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: 'Perm 3', value: formatList(options.perm3Command), inline: true },
                    { name: 'Perm 4', value: formatList(options.perm4Command), inline: true },
                )
                .setRequestedBy(message.author);
            return message.reply({ embeds: [embed] });
        }

        if (permToPutCommand !== '1' && permToPutCommand !== '2' && permToPutCommand !== '3' && permToPutCommand !== '4' && permToPutCommand !== 'everyone') return message.reply(lang.perm.permNotFound);
        if (!commandName) return message.reply(lang.perm.commandNotFound);
        if (!client.commands.has(commandName) && !client.aliases.has(commandName)) return message.reply(lang.perm.commandNotFound);

        const cmd = client.commands.get(commandName.toLowerCase().normalize()) || client.aliases.get(commandName.toLowerCase().normalize());
        commandName = cmd.name;

        if (permToPutCommand === '1') {
            options.perm1Command.push(commandName);
            options.perm2Command = options.perm2Command.filter(x => x !== commandName);
            options.perm3Command = options.perm3Command.filter(x => x !== commandName);
            options.perm4Command = options.perm4Command.filter(x => x !== commandName);
        } else if (permToPutCommand === '2') {
            options.perm2Command.push(commandName);
            options.perm1Command = options.perm1Command.filter(x => x !== commandName);
            options.perm3Command = options.perm3Command.filter(x => x !== commandName);
            options.perm4Command = options.perm4Command.filter(x => x !== commandName);
        } else if (permToPutCommand === '3') {
            options.perm3Command.push(commandName);
            options.perm1Command = options.perm1Command.filter(x => x !== commandName);
            options.perm2Command = options.perm2Command.filter(x => x !== commandName);
            options.perm4Command = options.perm4Command.filter(x => x !== commandName);
        } else if (permToPutCommand === '4') {
            options.perm4Command.push(commandName);
            options.perm1Command = options.perm1Command.filter(x => x !== commandName);
            options.perm2Command = options.perm2Command.filter(x => x !== commandName);
            options.perm3Command = options.perm3Command.filter(x => x !== commandName);
        } else if (permToPutCommand === 'everyone') {
            options.perm1Command = options.perm1Command.filter(x => x !== commandName);
            options.perm2Command = options.perm2Command.filter(x => x !== commandName);
            options.perm3Command = options.perm3Command.filter(x => x !== commandName);
            options.perm4Command = options.perm4Command.filter(x => x !== commandName);
        }

        await guildData.updatePerms(false, options).then(() => {
            message.reply(lang.perm.successCommand(commandName, permToPutCommand));
        });
    }
};
