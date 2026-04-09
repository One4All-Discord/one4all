const { PermissionFlagsBits } = require('discord.js');
const { version: djsversion } = require('discord.js');
const os = require('os');
const ms = require('ms');
const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class BotInfo extends Command {
    constructor() {
        super({
            name: 'botinfo',
            description: 'Informations sur le bot',
            category: 'info',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            aliases: ['infobot', 'bot'],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const versionData = require('../../version.json');

        let guildCount = client.guilds.cache.size;
        let userCount = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
        let channelCount = client.channels.cache.size;

        if (client.shard) {
            try {
                const g = await client.shard.fetchClientValues('guilds.cache.size');
                guildCount = g.reduce((a, b) => a + b, 0);
                const c = await client.shard.fetchClientValues('channels.cache.size');
                channelCount = c.reduce((a, b) => a + b, 0);
            } catch {}
        }

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
            )
            .addFields(
                { name: '\u200b', value: `**CPU** — ${os.cpus()[0].model}\n**Coeurs** — ${os.cpus().length}\n**Uptime serveur** — \`${ms(os.uptime() * 1000, { long: true })}\`` }
            );

        message.reply({ embeds: [embed] });
    }
};
