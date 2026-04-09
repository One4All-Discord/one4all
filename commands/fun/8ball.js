const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: '8ball',
            description: 'Answer to your question. | Répond a votre question.',
            usage: '8ball <question>',
            category: 'fun',
            tags: ['guildOnly'],
            aliases: ['8b'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);

        const color = guildData.color
        const lang = client.lang(guildData.lang)

        if (!args[0]) return message.reply(lang.ball.noQuestion)
        let replies = lang.ball.reponseQuestion
        let result = Math.floor((Math.random() * 8));
        let question = args.slice().join(" ");
        let ballembed = new Embed(client, guildData)
            .setAuthor({ name: `🎱 ${message.author.username}` })
            .addFields({ name: "Question", value: question })
            .addFields({ name: lang.ball.reponse, value: replies[result] })

        message.reply({ embeds: [ballembed] })

    }
};

