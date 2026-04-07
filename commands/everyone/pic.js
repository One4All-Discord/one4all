const { EmbedBuilder } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'pic',
            description: "Get the picture profile of an user | Avoir l'avatar d'un utilisateur",
            usage: 'pic [user]',
            aliases: ['pp', 'avatar'],
            cooldown: 5

        });
    }
    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const color = guildData.color
        const lang = client.lang(guildData.lang)
        let user = message.mentions.users.first();
        if (!isNaN(args[0])) user = await client.users.fetch(args[0]).catch()
        if (!user) user = message.author;
        const avatarURL = user.displayAvatarURL({size: 512}).replace(".webp", ".png");
        if (message.content.includes("-v")) message.channel.send("<" + avatarURL + ">");
        const embed = new EmbedBuilder()
            .setTitle(user.username)
            .setImage(avatarURL)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter({ text: client.user.username })
        message.channel.send({ embeds: [embed] });
    }
};

