const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class Derank extends Command {
    constructor() {
        super({
            name: 'derank',
            description: "Remove all roles of a member | Enlever tout les rôles d'un membre",
            usage: 'derank <mention / id>',
            category: 'moderation',
            aliases: ['unrank'],
            userPermissions: [PermissionFlagsBits.Administrator],
            clientPermissions: [PermissionFlagsBits.ManageRoles],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);

        let memberss = await message.mentions.members.first();
        let member;
        await message.guild.members.fetch().then((members) => {
            member = members.get(args[0]) || members.get(memberss.id);
        });

        if (!member) return message.reply(lang.derank.errorNoMember);
        if (member.user.id === client.user.id) return message.reply(lang.derank.errorUnrankMe);
        if (member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0 && message.guild.ownerId != message.author.id) return message.reply(lang.derank.errorRl(member));
        if (member.user.id === message.author.id) return message.reply(lang.derank.errorUnrankself);

        let roles = [];
        member.roles.cache.map(role => roles.push(role.id));
        if (roles.length === 1) return message.reply(lang.derank.errorNoRl(member));

        member.roles.remove(roles, lang.derank.reason(message.member)).then(() => {
            return message.reply(lang.derank.success(member));
        });
    }
};
