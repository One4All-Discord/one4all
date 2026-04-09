const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const randomPuppy = require('random-puppy')
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'meme',
            description: 'A meme command for Joke | Une commande meme pour rigoler',
            usage: 'meme',
            category: 'fun',
            tags: ['guildOnly'],
            aliases: ['!me'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }
    async run(client, message,args){
        const guildData = client.getGuildData(message.guild.id);

    const color = guildData.color
    const lang = client.lang(guildData.lang)
    const subReddits = ["dankememe", "meme", "memes"]
    const random = subReddits[Math.floor(Math.random() * 3) ]

    const img = await randomPuppy(random)

    const embed = new Embed(client, guildData)
        .setImage(img)
        .setTitle(lang.meme.reponse(random))
        .setURL(`https://reddit.com/r/${random}`)

    message.reply({ embeds: [embed] })
}};
