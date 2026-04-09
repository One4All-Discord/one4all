const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const StateManager = require('../../utils/StateManager');

const guildInventory = new Map();
const userCoins = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'inventory',
            description: 'Show your inventory | Afficher votre inventaire',
            // Optionnals :
            usage: 'inventory',
            category: 'coins',
            aliases: ['inv', 'bag'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        if (!guildData.config.coinsOn) return;

        const color = guildData.color
        const lang = client.lang(guildData.lang)

        const memberInvetory = client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).inventory
        const formatedInventory = !memberInvetory? `Inventaire vide` : memberInvetory.map((inv) => `**${inv.item}**  •  x\`${inv.amount}\``); // inv.item == itemName and inv.amount = number of 1 item
        const embed = new Embed(client, guildData)
            .setAuthor({ name: `Inventory of ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setDescription(formatedInventory)
            .setThumbnail(`https://media.discordapp.net/attachments/747028239884615751/821044567833968710/706473362813091931.gif`)
            .setFooter({ text: `© OneForAll Coins` })
        message.reply({ content: `> **Viewing server inventory • [**  ${message.author.username} **] •** `, embeds: [embed] })

    }
}
