const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

const fetch = require('node-fetch')

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'mybot',
            category: 'botperso',
            aliases: ['mybots', 'mesbot'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);


        const color = guildData.color
        const lang = client.lang(guildData.lang)
        const moderatorAuthorisation = {
            '188356697482330122': {
                name: 'khddev',
                auth: 'RerVzLrdYXBrC479'
            },

        }
        await fetch(`http://46.4.251.37:3000/api/client/${message.author.id}`, {
            "credentials": "include",
            "headers": {
                "content-type": "application/json",
                "referrerPolicy": "no-referrer-when-downgrade",
                "accept": "*/*",
                "authorization": `${moderatorAuthorisation['188356697482330122'].auth}`,
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "method": "GET",


        }).then(async res => {
            const result = await res.json();
            if (result.message) {
                const avatar = message.author.displayAvatarURL()

                const embed = new Embed(client, guildData)
                    .setTimestamp()
                    .setDescription(`
                    Vous n'avez pas de bot personnalisé
                `)
                    .setFooter({ text: message.author.username, iconURL: avatar })

                return message.reply({ embeds: [embed] })
            } else {

                let now = Date.now();
                now = new Date(now)
                const expireAt = new Date(result.client.expireAt)
                const timeLeft = prettyMilliseconds(expireAt.getTime() - now.getTime())
                const msg = await message.reply(lang.loading)
                const avatar = message.author.displayAvatarURL()
                const inv = `https://discord.com/oauth2/authorize?client_id=${result.client.botId}&scope=bot&permissions=8`
                const embed = new Embed(client, guildData)

                    .setDescription(`
                    [Invitation](${inv}) ・ **${timeLeft}**
                `)
                    .setTimestamp()
                    .setFooter({ text: message.author.username, iconURL: avatar })
                msg.edit({ embeds: [embed] })

            }
        })

    }
}


