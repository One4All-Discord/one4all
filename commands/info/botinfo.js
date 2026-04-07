const { PermissionFlagsBits } = require('discord.js');
const { version: djsversion } = require('discord.js');
const { version } = require('../../package.json');
const { utc } = require('moment');
const Embed = require('../../structures/Embed');

const os = require('os')
const ms = require('ms')
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'botinfo',
            description: 'Get the information about the bot | Avoir les informations concernant le bot',
            category: 'info',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            aliases: ['infobot', 'bot'],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        let guildCount = client.guilds.cache.size;
        let channelCount = client.channels.cache.size;
        let userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        if (client.shard) {
            try {
                const guildArray = await client.shard.fetchClientValues("guilds.cache.size");
                guildCount = guildArray.reduce((acc, val) => acc + val, 0);
                const channelArray = await client.shard.fetchClientValues("channels.cache.size");
                channelCount = channelArray.reduce((acc, val) => acc + val, 0);
                const userArray = await client.shard.broadcastEval(c => c.guilds.cache.filter(g => g.available).reduce((acc, guild) => acc + guild.memberCount, 0));
                userCount = userArray.reduce((acc, val) => acc + val, 0);
            } catch (e) {
                console.error('[botinfo] Shard fetch error:', e.message);
            }
        }

        const core = os.cpus()[0];
        const embedBot = new Embed(client, guildData)
            .setThumbnail(client.user.displayAvatarURL())
            .setRequestedBy(message.author)
            .addFields({
                name: '✦ Informations',
                value: [
                    `◈ Date de création: **${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}**`,
                    `◈ Développeur: **KhdDev**`,
                    `◈ Node.js: **${process.version}**`,
                    `◈ Version: **v${version}**`,
                    `◈ Discord.js: **v${djsversion}**`,
                    `◈ Bot Uptime: **${ms(client.uptime)}**`,
                ].join('\n')
            })
            .addFields({
                name: '✦ Statistiques',
                value: [
                    `◈ Serveurs: **${guildCount.toLocaleString()}**`,
                    `◈ Users: **${userCount.toLocaleString()}**`,
                    `◈ Channels: **${channelCount.toLocaleString()}**`,
                ].join('\n')
            })
            .addFields({
                name: '✦ Système',
                value: [
                    `◈ Platforme: **${process.platform}**`,
                    `◈ Uptime: **${ms(os.uptime() * 1000, {long: true})}**`,
                    `◈ CPU:`,
                    `\u3000 Coeurs: **${os.cpus().length}**`,
                    `\u3000 Modèle: **${core.model}**`,
                    `\u3000 Vitesse: **${core.speed}**MHz`,
                ].join('\n')
            });

        message.channel.send({ embeds: [embedBot] });
    }
};
