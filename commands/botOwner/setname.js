const { PermissionFlagsBits } = require('discord.js');


const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'setname',
            description: 'definir le nom du bot',
            usage: 'setname dd',
            category: 'botOwner',
            aliases: ['setname', 'setprenom', 'setnom'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            ownerOnly: true,
            cooldown: 20
        });
    }
    async run(client, message,args) {
        const guildData = client.getGuildData(message.guild.id);


        const color = guildData.color

        if (args.length) {
            let str_content = args.join(" ")
            client.user.setUsername(str_content)
                .then(u => message.reply(`${message.author}, Vous avez changé le pseudonyme de votre bot.`))
                .catch(e => {
                    return message.reply(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });
        } else {
            message.reply(` ${message.author}, Vous avez fournie aucune valeur, veuillez mettre comment vous souhaitez nommé votre bot`);
        }
    }
};
