const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const userCoins = new Map();
const coinSettings = new Map();
const guildShop = new Map();
const guildInventory = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'buy',
            description: 'Buy an item from the shop | Acheter un item du magasin',
            // Optionnals :
            usage: 'buy <itemId>',
            category: 'coins',
            tags: ['guildOnly'],
            aliases: ['acheter'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        if(!guildData.config.coinsOn) return;
        const color = guildData.color
        const lang = client.lang(guildData.lang)

        const idToBuy = args[0];
        if (!guildData.config.coinsOn) return message.channel.send(lang.buy.shoDisable).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
        if (!idToBuy) return message.channel.send(lang.buy.syntaxError).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
        const shop = guildData.shop;
        let coins = client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).coins
        if (!coins) return message.channel.send(lang.buy.noCoins).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        if (coins < 1 || !coins) return message.channel.send(lang.buy.noCoins).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        if (shop.find(shop => shop.id === 0)) return message.channel.send(lang.buy.nothingInShop).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        if (shop.length < parseInt(idToBuy) || parseInt(idToBuy) < 1) return message.channel.send(lang.buy.itemNotInShop).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));

        const {price, role, item} = shop.filter(shop => shop.id === parseInt(idToBuy))[0]
        if (price > coins) return message.channel.send(lang.buy.notEnoughCoins).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
        let roleCol;
        coins -= price

        if (role) {
            roleCol = message.guild.roles.cache.get(item.replace('<@&', '').replace('>', ''));

            if (message.member.roles.cache.has(roleCol.id)) return message.channel.send(lang.buy.alreadyRole).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))


            message.channel.send(lang.buy.success(`**${roleCol.name}**`, price)).then((mp) => {
                setTimeout(() => mp.delete().catch(() => {}), 4000)
                message.member.roles.add(roleCol.id, `Coins shop`)
            })
        } else {

            message.channel.send(lang.buy.success(item, price)).then(() => {
                let memberInvetory = client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).inventory
                const itemBuyed = shop.filter(shop => shop.id === parseInt(idToBuy))[0]

                let messageMemberInvetory = client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).inventory
                if (messageMemberInvetory) { // if already member has a inv
                    // [{}, {}, {}, {}, {}, {}, {}, {}, {}]
                    console.log(messageMemberInvetory)

                    let itemOccurence = messageMemberInvetory.filter(inv => inv.id === itemBuyed.id);


                    if (itemOccurence[0] && itemOccurence[0].amount >= 1) {
                        const itemOccurenceCount = itemOccurence[0].amount;

                        itemOccurence[0].amount = itemOccurenceCount + 1;

                    } else {
                        messageMemberInvetory.push(itemBuyed);
                    }


                    client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).updateInventory = messageMemberInvetory
                } else {
                    console.log('created')
                    client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).createInventory([itemBuyed])
                }


            })
        }
        client.getMemberData(message.guild.id, message.member.user?.id || message.member.id).updateCoins = coins;

        const logsChannel = message.guild.channels.cache.get(guildData.config.coinsLogs);
        if (logsChannel && logsChannel.manageable && !logsChannel.deleted) {
            const embed = new EmbedBuilder()
                .setDescription(lang.buy.buyLog(message.member, !roleCol ? item : roleCol.name, price))
                .setTimestamp()
                .setColor(`${color}`)
            logsChannel.send({ embeds: [embed] })
        }


    }
};

