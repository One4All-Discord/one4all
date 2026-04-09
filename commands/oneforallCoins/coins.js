const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const userCoins = new Map();
const coinSettings = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'coins',
            description: 'Show how many coins you have | Affiche le nombre de coins que vous avez',
            // Optionnals :
            usage: 'coins [mention/id]',
            category: 'coins',
            tags: ['guildOnly'],
            aliases: ['balance', 'argent', 'money'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        if(!guildData.config.coinsOn) return;

        let member = message.mentions.members.first()  || await message.guild.members.fetch(args[0])
        if(!args[0]) member = message.member;
        let coins = !client.getMemberData(message.guild.id, member.user?.id || member.id).coins ? 'Aucun' : client.getMemberData(message.guild.id, member.user?.id || member.id).coins;
        const embed = new Embed(client, guildData)
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
            .setColor(guildData.color)
            .setFooter({ text: client.user.username })
            .setDescription(client.lang(guildData.lang).coins.description(coins));

        await message.reply({ embeds: [embed] })

    }
}
