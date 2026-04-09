const { PermissionFlagsBits, UserFlags } = require('discord.js');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');

module.exports = class UserInfo extends Command {
    constructor() {
        super({
            name: 'userinfo',
            description: "Get information about an user | Avoir des informations d'un utilisateur",
            usage: 'userinfo [mention / id]',
            category: 'info',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            aliases: ['infouser', 'ui'],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const badges = {
            [UserFlags.Staff]: '<:staff:1127989892438245457> Staff Discord',
            [UserFlags.Partner]: '<:partner:1127989890341064704> Partenaire',
            [UserFlags.BugHunterLevel1]: 'Bug Hunter',
            [UserFlags.BugHunterLevel2]: 'Bug Hunter Gold',
            [UserFlags.HypeSquadOnlineHouse1]: '<:bravery:1127989888214880256> Bravery',
            [UserFlags.HypeSquadOnlineHouse2]: '<:brilliance:1127989886134550538> Brilliance',
            [UserFlags.HypeSquadOnlineHouse3]: '<:balance:1127989884058365952> Balance',
            [UserFlags.Hypesquad]: 'HypeSquad Events',
            [UserFlags.PremiumEarlySupporter]: 'Early Supporter',
            [UserFlags.VerifiedDeveloper]: 'Developpeur verifie',
            [UserFlags.ActiveDeveloper]: 'Developpeur actif',
            [UserFlags.VerifiedBot]: 'Bot verifie',
            [UserFlags.CertifiedModerator]: 'Moderateur certifie',
        };

        const statusEmojis = {
            online: '🟢 En ligne',
            idle: '🟡 Inactif',
            dnd: '🔴 Ne pas deranger',
            offline: '⚫ Hors ligne'
        };

        const argument = args[0];
        let member;
        if (argument) {
            member = message.mentions.members.first() || message.guild.members.cache.get(argument);
            if (!member) {
                try { member = await message.guild.members.fetch(argument); } catch {}
            }
        }
        if (!member) member = message.member;

        const user = member.user;

        // Badges
        const userFlags = user.flags?.toArray() || [];
        const badgeList = userFlags.map(f => badges[f]).filter(Boolean);
        if (user.bot) badgeList.push('🤖 Bot');
        const badgeDisplay = badgeList.length ? badgeList.join('\n> ') : 'Aucun';

        // Roles (top 15, sans @everyone)
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(r => r.id !== message.guild.id);
        let roleDisplay = roles.first(15).map(r => r.toString()).join(' ');
        if (roles.size > 15) roleDisplay += ` ... +${roles.size - 15}`;
        if (!roleDisplay) roleDisplay = 'Aucun';

        // Permissions cles
        const keyPerms = [];
        if (member.permissions.has(PermissionFlagsBits.Administrator)) keyPerms.push('Administrateur');
        else {
            if (member.permissions.has(PermissionFlagsBits.ManageGuild)) keyPerms.push('Gerer le serveur');
            if (member.permissions.has(PermissionFlagsBits.ManageRoles)) keyPerms.push('Gerer les roles');
            if (member.permissions.has(PermissionFlagsBits.ManageChannels)) keyPerms.push('Gerer les salons');
            if (member.permissions.has(PermissionFlagsBits.BanMembers)) keyPerms.push('Bannir');
            if (member.permissions.has(PermissionFlagsBits.KickMembers)) keyPerms.push('Expulser');
            if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) keyPerms.push('Timeout');
        }
        const permDisplay = keyPerms.length ? keyPerms.join(', ') : 'Aucune permission cle';

        // Status
        const status = statusEmojis[member.presence?.status || 'offline'];

        // Activite
        let activity = 'Aucune';
        if (member.presence?.activities?.length) {
            const act = member.presence.activities[0];
            if (act.name === 'Custom Status') {
                activity = act.state || 'Statut personnalise';
            } else {
                activity = `${act.name}`;
            }
        }

        // Timestamps Discord natifs
        const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`;
        const createdRelative = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
        const joinedAt = `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`;
        const joinedRelative = `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`;

        // Position dans le serveur (par date de join)
        const sortedMembers = [...message.guild.members.cache.values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        const joinPosition = sortedMembers.findIndex(m => m.id === member.id) + 1;

        // Booster
        const boostingSince = member.premiumSince
            ? `Depuis <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`
            : null;

        const embed = new Embed(client, guildData)
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 512 }) })
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setDescription([
                `> ${user} ・ \`${user.username}\` ・ \`${user.id}\``,
                `> ${status}`,
                activity !== 'Aucune' ? `> 🎮 ${activity}` : null,
                boostingSince ? `> 💎 Booster ・ ${boostingSince}` : null,
            ].filter(Boolean).join('\n'))
            .addFields(
                {
                    name: 'Dates',
                    value: [
                        `> 📅 Compte cree: ${createdAt} (${createdRelative})`,
                        `> 📥 A rejoint: ${joinedAt} (${joinedRelative})`,
                        `> 📊 Position: \`#${joinPosition}\` / \`${message.guild.memberCount}\``,
                    ].join('\n'),
                },
                {
                    name: 'Badges',
                    value: `> ${badgeDisplay}`,
                    inline: true,
                },
                {
                    name: 'Role principal',
                    value: `> ${member.roles.hoist || 'Aucun'}`,
                    inline: true,
                },
                {
                    name: `Roles [${roles.size}]`,
                    value: roleDisplay,
                },
                {
                    name: 'Permissions cles',
                    value: `> ${permDisplay}`,
                },
            )
            .setRequestedBy(message.author);

        // Banner si disponible
        try {
            const fetched = await user.fetch();
            if (fetched.bannerURL()) {
                embed.setImage(fetched.bannerURL({ size: 1024 }));
            }
        } catch {}

        return message.reply({ embeds: [embed] });
    }
};
