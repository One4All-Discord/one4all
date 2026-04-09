const { PermissionFlagsBits, ChannelType, GuildVerificationLevel, GuildPremiumTier } = require('discord.js');
const Embed = require('../../structures/Embed');
const moment = require('moment');
moment.locale('fr');

const Command = require('../../structures/Handler/Command');
module.exports = class ServerInfo extends Command {
    constructor() {
        super({
            name: 'serverinfo',
            description: 'Get information about the server | Avoir des information concernant le serveur',
            category: 'info',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            aliases: ['infoserver', 'si'],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guild = message.guild;
        const guildData = client.getGuildData(guild.id);

        const verificationLevels = {
            [GuildVerificationLevel.None]: 'Aucune',
            [GuildVerificationLevel.Low]: 'Faible',
            [GuildVerificationLevel.Medium]: 'Moyenne',
            [GuildVerificationLevel.High]: 'Haute',
            [GuildVerificationLevel.VeryHigh]: 'Tres haute'
        };

        const boostTiers = {
            [GuildPremiumTier.None]: 'Aucun',
            [GuildPremiumTier.Tier1]: 'Niveau 1',
            [GuildPremiumTier.Tier2]: 'Niveau 2',
            [GuildPremiumTier.Tier3]: 'Niveau 3'
        };

        const channels = guild.channels.cache;
        const members = guild.members.cache;
        const emojis = guild.emojis.cache;
        const stickers = guild.stickers.cache;
        const roles = guild.roles.cache.sort((a, b) => b.position - a.position);

        // Stats membres
        const online = members.filter(m => m.presence?.status === 'online').size;
        const idle = members.filter(m => m.presence?.status === 'idle').size;
        const dnd = members.filter(m => m.presence?.status === 'dnd').size;
        const offline = members.filter(m => !m.presence || m.presence.status === 'offline').size;
        const bots = members.filter(m => m.user.bot).size;
        const humans = guild.memberCount - bots;

        // Stats salons
        const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
        const categories = channels.filter(c => c.type === ChannelType.GuildCategory).size;
        const forums = channels.filter(c => c.type === ChannelType.GuildForum).size;
        const stages = channels.filter(c => c.type === ChannelType.GuildStageVoice).size;

        // Owner
        const owner = await guild.members.fetch(guild.ownerId);

        // Roles (top 15)
        let roleList = roles.filter(r => r.id !== guild.id).map(r => r.toString()).slice(0, 15).join(' ');
        if (roleList.length > 1024) roleList = roles.filter(r => r.id !== guild.id).map(r => r.toString()).slice(0, 8).join(' ') + ' ...';
        if (!roleList) roleList = 'Aucun';
        const roleCount = roles.size - 1; // -1 pour @everyone

        // Emojis (top 20)
        const normalEmojis = emojis.filter(e => !e.animated);
        const animatedEmojis = emojis.filter(e => e.animated);
        let emojiPreview = emojis.first(20).map(e => e.toString()).join(' ');
        if (!emojiPreview) emojiPreview = 'Aucun';

        // Date creation
        const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`;
        const createdRelative = `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`;

        // AFK
        const afkChannel = guild.afkChannelId ? `<#${guild.afkChannelId}> (${guild.afkTimeout / 60}min)` : 'Aucun';

        // System channel
        const systemChannel = guild.systemChannelId ? `<#${guild.systemChannelId}>` : 'Aucun';

        // Rules channel
        const rulesChannel = guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : 'Aucun';

        const embed = new Embed(client, guildData)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 512 }) })
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .setDescription([
                `> **ID:** \`${guild.id}\``,
                `> **Proprietaire:** ${owner.user} (\`${owner.user.username}\`)`,
                `> **Cree le:** ${createdAt} (${createdRelative})`,
                `> **Langue:** \`${guild.preferredLocale}\``,
            ].join('\n'))
            .addFields(
                {
                    name: `\u200b\nMembres [${guild.memberCount}]`,
                    value: [
                        `> Humains: \`${humans}\` | Bots: \`${bots}\``,
                        `> \`\`\``,
                        `> En ligne : ${online}`,
                        `> Inactif  : ${idle}`,
                        `> Ne pas deranger : ${dnd}`,
                        `> Hors ligne : ${offline}`,
                        `> \`\`\``,
                    ].join('\n'),
                    inline: true
                },
                {
                    name: `\u200b\nSalons [${channels.size}]`,
                    value: [
                        `> Textuels: \`${textChannels}\``,
                        `> Vocaux: \`${voiceChannels}\``,
                        `> Categories: \`${categories}\``,
                        forums > 0 ? `> Forums: \`${forums}\`` : null,
                        stages > 0 ? `> Scenes: \`${stages}\`` : null,
                    ].filter(Boolean).join('\n'),
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Boosts',
                    value: [
                        `> Niveau: **${boostTiers[guild.premiumTier]}**`,
                        `> Boosts: \`${guild.premiumSubscriptionCount || 0}\``,
                    ].join('\n'),
                    inline: true
                },
                {
                    name: 'Securite',
                    value: [
                        `> Verification: **${verificationLevels[guild.verificationLevel]}**`,
                        `> Filtre contenu: **${guild.explicitContentFilter === 0 ? 'Desactive' : guild.explicitContentFilter === 1 ? 'Sans role' : 'Tous'}**`,
                    ].join('\n'),
                    inline: true
                },
                {
                    name: 'Divers',
                    value: [
                        `> AFK: ${afkChannel}`,
                        `> Systeme: ${systemChannel}`,
                        `> Regles: ${rulesChannel}`,
                    ].join('\n'),
                    inline: true
                },
                {
                    name: `Roles [${roleCount}]`,
                    value: roleList
                },
                {
                    name: `Emojis [${emojis.size}] (${normalEmojis.size} fixes, ${animatedEmojis.size} animes)${stickers.size > 0 ? ` | Stickers [${stickers.size}]` : ''}`,
                    value: emojiPreview
                },
            )
            .setRequestedBy(message.author);

        if (guild.bannerURL()) {
            embed.setImage(guild.bannerURL({ size: 1024 }));
        }

        message.reply({ embeds: [embed] });
    }
};
