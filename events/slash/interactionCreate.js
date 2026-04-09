const Event = require('../../structures/Handler/Event');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits, ChannelType, GuildVerificationLevel, GuildPremiumTier, UserFlags } = require('discord.js');
const { version: djsversion } = require('discord.js');
const ms = require('ms');
const os = require('os');

module.exports = class InteractionCreate extends Event {
    constructor() {
        super({
            name: 'interactionCreate',
        });
    }

    async run(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guild) return;

        const guildData = client.getGuildData(interaction.guild.id);
        const guild = interaction.guild;

        if (interaction.commandName === 'ping') {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Pong !', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    { name: 'Latence', value: `\`${Date.now() - interaction.createdTimestamp}ms\``, inline: true },
                    { name: 'API Discord', value: `\`${Math.round(client.ws.ping)}ms\``, inline: true },
                );
            await interaction.reply({ embeds: [embed] });
        }

        else if (interaction.commandName === 'help') {
            const p = guildData.prefix;
            const categories = [
                { name: 'Owner', icon: '👑', key: 'owner' },
                { name: 'Anti-Raid', icon: '🛡️', key: 'antiraid' },
                { name: 'Modération', icon: '⚔️', key: 'mod' },
                { name: 'Utilitaires', icon: '🔧', key: 'misc' },
                { name: 'Backup', icon: '💾', key: 'backup' },
                { name: 'Invitations', icon: '📨', key: 'invite' },
                { name: 'Économie', icon: '💰', key: 'coins' },
                { name: 'Musique', icon: '🎵', key: 'music' },
                { name: 'Fun', icon: '🎮', key: 'fun' },
                { name: 'Général', icon: '📋', key: 'general' },
            ];

            const left = categories.slice(0, 5);
            const right = categories.slice(5);

            const embed = new Embed(client, guildData)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
                .setDescription(`Bienvenue sur **${client.user.username}** !\nPrefix : \`${p}\`\n\u200b`)
                .addFields(
                    { name: '\u200b', value: left.map(c => `${c.icon} **${c.name}**\n\`${p}help ${c.key}\``).join('\n\n'), inline: true },
                    { name: '\u200b', value: right.map(c => `${c.icon} **${c.name}**\n\`${p}help ${c.key}\``).join('\n\n'), inline: true },
                )
                .addFields({ name: '\u200b', value: `\`${p}help <commande>\` — détail d'une commande\n[Serveur support](https://discord.gg/TfwGcCjyfp)` });

            await interaction.reply({ embeds: [embed] });
        }

        else if (interaction.commandName === 'botinfo') {
            const versionData = require('../../version.json');
            let guildCount = client.guilds.cache.size;
            let userCount = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
            let channelCount = client.channels.cache.size;

            const embed = new Embed(client, guildData)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
                .setDescription(
                    `Version **${versionData.version}** — par **KhdDev**\n` +
                    `Uptime : \`${ms(client.uptime, { long: true })}\`\n\u200b`
                )
                .addFields(
                    { name: 'Serveurs', value: `\`${guildCount}\``, inline: true },
                    { name: 'Utilisateurs', value: `\`${userCount}\``, inline: true },
                    { name: 'Salons', value: `\`${channelCount}\``, inline: true },
                )
                .addFields(
                    { name: 'Node.js', value: `\`${process.version}\``, inline: true },
                    { name: 'Discord.js', value: `\`v${djsversion}\``, inline: true },
                    { name: 'Plateforme', value: `\`${process.platform}\``, inline: true },
                );

            await interaction.reply({ embeds: [embed] });
        }

        else if (interaction.commandName === 'userinfo') {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = await guild.members.fetch(user.id).catch(() => null);
            if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true });

            const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`;
            const joinedAt = `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`;
            const roles = member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== guild.id);
            let roleDisplay = roles.first(10).map(r => r.toString()).join(' ');
            if (roles.size > 10) roleDisplay += ` +${roles.size - 10}`;

            const embed = new Embed(client, guildData)
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 512 }) })
                .setThumbnail(user.displayAvatarURL({ size: 512 }))
                .setDescription(`${user} · \`${user.id}\`\n\u200b`)
                .addFields(
                    { name: 'Compte créé', value: createdAt, inline: true },
                    { name: 'A rejoint', value: joinedAt, inline: true },
                    { name: `Rôles [${roles.size}]`, value: roleDisplay || 'Aucun' },
                );

            await interaction.reply({ embeds: [embed] });
        }

        else if (interaction.commandName === 'serverinfo') {
            const owner = await guild.members.fetch(guild.ownerId);
            const channels = guild.channels.cache;
            const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
            const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;

            const embed = new Embed(client, guildData)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ size: 512 }) })
                .setThumbnail(guild.iconURL({ size: 512 }))
                .setDescription(`\`${guild.id}\`\nPropriétaire : ${owner.user}\n\u200b`)
                .addFields(
                    { name: 'Membres', value: `\`${guild.memberCount}\``, inline: true },
                    { name: 'Salons', value: `\`${textChannels}\` textuels · \`${voiceChannels}\` vocaux`, inline: true },
                    { name: 'Rôles', value: `\`${guild.roles.cache.size}\``, inline: true },
                    { name: 'Boosts', value: `\`${guild.premiumSubscriptionCount || 0}\``, inline: true },
                    { name: 'Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                );

            await interaction.reply({ embeds: [embed] });
        }

        else if (interaction.commandName === 'ban') {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || `Ban par ${interaction.user.username}`;
            const member = await guild.members.fetch(user.id).catch(() => null);

            if (member && !member.bannable) {
                return interaction.reply({ content: 'Impossible de bannir ce membre.', ephemeral: true });
            }

            await guild.members.ban(user.id, { reason });
            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Ban', iconURL: client.user.displayAvatarURL() })
                .setDescription(`**${user.username}** a été banni\n**Raison** — ${reason}`);
            await interaction.reply({ embeds: [embed] });
        }

        else if (interaction.commandName === 'kick') {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || `Kick par ${interaction.user.username}`;
            const member = await guild.members.fetch(user.id).catch(() => null);

            if (!member || !member.kickable) {
                return interaction.reply({ content: 'Impossible d\'expulser ce membre.', ephemeral: true });
            }

            await member.kick(reason);
            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Kick', iconURL: client.user.displayAvatarURL() })
                .setDescription(`**${user.username}** a été expulsé\n**Raison** — ${reason}`);
            await interaction.reply({ embeds: [embed] });
        }

        else if (interaction.commandName === 'clear') {
            const amount = interaction.options.getInteger('amount');
            const deleted = await interaction.channel.bulkDelete(amount, true);
            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Clear', iconURL: client.user.displayAvatarURL() })
                .setDescription(`**${deleted.size}** messages supprimés`);
            await interaction.reply({ embeds: [embed] }).then(msg => setTimeout(() => interaction.deleteReply().catch(() => {}), 5000));
        }

        else if (interaction.commandName === 'play') {
            const query = interaction.options.getString('query');
            if (!interaction.member.voice.channel) {
                return interaction.reply({ content: 'Vous devez être dans un salon vocal.', ephemeral: true });
            }

            await interaction.deferReply();
            try {
                const { track } = await client.music.play(interaction.member.voice.channel, query, {
                    nodeOptions: {
                        metadata: { channel: interaction.channel },
                        leaveOnEmpty: false,
                        leaveOnEnd: false,
                        leaveOnStop: false,
                    },
                    requestedBy: interaction.user,
                });

                const embed = new Embed(client, guildData)
                    .setAuthor({ name: 'Ajoutée à la file', iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(track.thumbnail)
                    .setDescription(`**[${track.title}](${track.url})**\n\u200b`)
                    .addFields(
                        { name: 'Durée', value: `\`${track.duration}\``, inline: true },
                        { name: 'Source', value: `\`${track.source || 'Inconnu'}\``, inline: true },
                    );
                await interaction.editReply({ embeds: [embed] });
            } catch (e) {
                console.error(e);
                await interaction.editReply('Impossible de lire cette piste.');
            }
        }
    }
};
