const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'shop',
            description: 'Show the shop / Manage item to the shop | Afficher le magasin / Montrer le shop / Gerer les objets dans le shop',
            // Optionnals :
            usage: 'shop [create/delete/add/edit/remove] [item/itemId] [prix]',
            category: 'coins',
            aliases: ['store', 'magasin'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions],
            cooldown: 2,
            guildOwnerOnly: true
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        let owner = message.guild.ownerId;

        if (client.botperso) {
            const fs = require('fs');
            const path = './config.json';
            if (fs.existsSync(path)) {
                owner = require('../../config.json').owner;
            } else {
                owner = process.env.OWNER
            }
        }
        const color = guildData.color
        const lang = client.lang(guildData.lang);
        let shop;
        if(guildData.shop)  shop = [...guildData.shop ]
        if (args[0] === "create") {
            if (shop) return message.reply(lang.addShop.alreadyShop)

            await guildData.createShop().then(() => {
                shop = [{id: 0, item: lang.addShop.nothingInShop, price: undefined, role: undefined}]
            })


            return message.reply(lang.addShop.create).then(mp => setTimeout(() => mp.delete().catch(() => {}), 5000))
        } else if (args[0] === "delete") {
            if(!guildData.shop) return message.reply(lang.addShop.noShop)



            
            return await guildData.deleteShop().then(() => {
                message.reply(lang.addShop.delete).then(mp => setTimeout(() => mp.delete().catch(() => {}), 5000))
            })

        }
        if(!guildData.shop) return message.reply(lang.addShop.noShop)
        const actualShop = shop.filter(shop => shop.price !== undefined)
        if (args[0] === 'add') {
            /**
             * Shop...
             * @param args[1] {shop item}
             * @param args[2] {price}
             * @param [{id, item, price, role}]
             **/
            const itemName = args.slice(1, args.length - 1).join(" ")
            const price = args[args.length - 1]
            if (!itemName) return message.reply(lang.addShop.noItem).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            if (!price || isNaN(price)) return message.reply(lang.addShop.noPrice).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            if (parseInt(price) === 0) return message.reply(lang.addShop.priceInf0).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            const isRl = !message.mentions.roles.first() ? undefined : !isNaN(args[1]) ? message.guild.roles.cache.get(args[1]) : message.mentions.roles.first();

            if (isRl) {
                let lastItemId = 0;

                if (actualShop[actualShop.length - 1] !== undefined) lastItemId = actualShop[actualShop.length - 1].id
                actualShop.push({
                    id: lastItemId + 1,
                    item: `<@&${isRl.id}>`,
                    price: parseInt(price),
                    role: true,
                    amount: 1
                })

                ajustShopId(actualShop);

            } else {

                let lastItemId = 0;

                if (actualShop[actualShop.length - 1] !== undefined) lastItemId = actualShop[actualShop.length - 1].id
                actualShop.push({id: lastItemId + 1, item: itemName, price: parseInt(price), role: false, amount: 1})

                ajustShopId(actualShop);

            }

            shop = actualShop

            await guildData.updateShop(actualShop)
            return message.reply(lang.addShop.successAdd(itemName, price)).then(mp => {
                showShop(actualShop)
                setTimeout(() => mp.delete().catch(() => {}), 5000)
            })


        } else if (args[0] === "remove") {
            if (!args[1]) return message.reply(lang.addShop.noIdToDelete).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            if (isNaN(args[1])) return message.reply(lang.addShop.onlyNumber).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            if (!actualShop.find(shop => shop.id === parseInt(args[1]))) return message.reply(lang.addShop.notFoundItem).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            let newShop = actualShop.filter(shop => shop.id !== parseInt(args[1]));
            const itemRemove = actualShop.filter(shop => shop.id === parseInt(args[1]));
            console.log(newShop)
            if (newShop.length === 0) {
                newShop = [{id: 0, item: lang.addShop.nothingInShop, prix: undefined, role: undefined}]
                
                showShop(newShop)
                return await guildData.deleteShop()
            } else {
                newShop = ajustShopId(newShop)
            }

            await guildData.updateShop(newShop)

            shop = newShop



            return await message.reply(lang.addShop.successRemove(itemRemove[0].item)).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000)).then(() => {
                showShop(newShop)

            })


        } else if (!args[0]) {
            showShop(shop)
        } else if (args[0] === 'edit') {
            if (!client.isGuildOwner(guildData.owners, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.reply(lang.error.notListOwner)
            if (!args[1]) return message.reply(lang.addShop.syntaxEdit).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            if (isNaN(args[1])) return message.reply(lang.addShop.onlyNumber).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            if (!actualShop.find(shop => shop.id === parseInt(args[1]))) return message.reply(lang.addShop.notFoundItem).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
            const itemToEdit = actualShop.filter(shop => shop.id === parseInt(args[1]));
            const editMsg = await message.reply(lang.loading)
            const emoji = ['🎫', '💰', '❌', '✅']
            for (const em of emoji) await editMsg.react(em) // react to msg with emoji list
            const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            const embed = new Embed(client, guildData)
                .setAuthor({ name: itemToEdit[0].item, iconURL: client.user.displayAvatarURL() })
                .setDescription(`
            ${lang.addShop.editCondition}

            ID : ${itemToEdit[0].id}\n
            ${emoji[0]} NAME : ${itemToEdit[0].item}\n
            ${emoji[1]} PRICE : ${itemToEdit[0].price.toLocaleString()}\n
            ROLE : ${itemToEdit[0].role}

            ${emoji[3]} : SAVE
        `)
                .setFooter({ text: `OneForAll Shop`, iconURL: client.user.displayAvatarURL() })
            editMsg.edit({ embeds: [embed] }).then(async m => {
                const collector = m.createReactionCollector({ filter: filter, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === emoji[0]) {
                        message.reply(lang.addShop.newNameQ).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(cld => {
                                    let msg = cld.first();
                                    if (msg.content === "cancel") return message.reply(lang.cancel).then(mps => {
                                        setTimeout(() => {
                                            msWriteProfilerMark.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 4000)
                                    })
                                    const isRl = msg.mentions.roles.first() || isNaN(msg.content) ? undefined : message.guild.roles.cache.get(msg.content);
                                    if (isRl) {
                                        itemToEdit[0].item = `<@&${isRl.id}>`;
                                        itemToEdit[0].role = true;
                                    } else {
                                        itemToEdit[0].item = msg.content;
                                        itemToEdit[0].role = false;
                                    }
                                    message.reply(lang.addShop.successEditItemName(msg.content)).then((mps) => {
                                        updateEmbed()
                                        setTimeout(() => {
                                            mps.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 4000)
                                    })

                                });
                        })
                    } else if (r.emoji.name === emoji[1]) {
                        message.reply(lang.addShop.newPriceQ).then(mp => {
                            mp.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000})
                                .then(cld => {
                                    let msg = cld.first();
                                    if (isNaN(msg.content)) return message.reply(lang.addShop.noPrice).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
                                    if (parseInt(msg.content) === 0) return message.reply(lang.addShop.priceInf0).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000))
                                    message.reply(lang.addShop.successEditItemPrice(msg.content)).then((mps) => {
                                        itemToEdit[0].price = parseInt(msg.content);
                                        updateEmbed()
                                        setTimeout(() => {
                                            mps.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 4000)
                                    })

                                });
                        })
                    } else if (r.emoji.name === emoji[2]) {
                        message.reply(lang.addShop.cancel).then((mps) => {
                            collector.stop();
                            setTimeout(() => {
                                mps.delete();
                                editMsg.delete();
                                itemToEdit[0] = actualShop.filter(shop => shop.id === parseInt(args[1])); // reassociate item to edit to the actual shop because cancel
                            }, 2000)
                        })
                    } else if (r.emoji.name === emoji[3]) {
                        if (actualShop.filter(shop => shop.id === parseInt(args[1])) === itemToEdit) return message.reply(lang.addShop.noModification);
                        actualShop[itemToEdit[0].id - 1] = itemToEdit[0];

                        guildData.updateShop(actualShop).then(() => {
                            message.reply(lang.addShop.successEdit).then(() => {
                                shop.get(message.guild.id, actualShop);
                                ajustShopId(actualShop);
                                showShop(actualShop);
                            })

                        })

                    }
                })

                function updateEmbed() {
                    embed.setDescription(`
                ${lang.addShop.editCondition}
    
                ID : ${itemToEdit[0].id}\n
                ${emoji[0]} NAME : ${itemToEdit[0].item}\n
                ${emoji[1]} PRICE : ${itemToEdit[0].price.toLocaleString()}\n
                ROLE : ${itemToEdit[0].role}
    
                ${emoji[3]} : SAVE
            `)
                    editMsg.edit({ embeds: [embed] })

                }
            })
        }

        function showShop(shop) {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription(lang.addShop.shopDesc(message.guild.name))
                .addFields({ name: '\u200b', value: shop.map(shop => !shop.price ? lang.addShop.nothingInShop : `\`${shop.id}\` ${shop.item} — [⏣ ${shop.price.toLocaleString()}](https://discord.gg/TfwGcCjyfp) coins`).toString() })
                .setFooter({ text: `⏣ OneForAll coins` });


            return message.reply({ embeds: [embed] })
        }
    }
};

function ajustShopId(shop) {
    const sortedShop = shop.sort((a, b) => a.price - b.price);
    for (let i = 0; i < sortedShop.length; i++) {
        sortedShop[i].id = i + 1;
    }
    shop = sortedShop
    return shop;

}

