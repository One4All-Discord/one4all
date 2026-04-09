const Embed = require('../../structures/Embed');
const Command = require('../../structures/Handler/Command');

module.exports = class Pic extends Command {
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
        let user = message.mentions.users.first();
        if (!isNaN(args[0])) user = await client.users.fetch(args[0]).catch(() => null);
        if (!user) user = message.author;

        const avatarURL = user.displayAvatarURL({ size: 512 }).replace('.webp', '.png');
        if (message.content.includes('-v')) message.reply('<' + avatarURL + '>');

        const embed = new Embed(client, guildData)
            .setAuthor({ name: user.username, iconURL: avatarURL })
            .setImage(avatarURL);
        message.reply({ embeds: [embed] });
    }
};
