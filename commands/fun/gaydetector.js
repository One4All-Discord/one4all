const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'gaydetector',
            description: 'A command for look a gay people | Une commande pour detecter les gays',
            usage: 'gaydetector <id/member> ',
            category: 'fun',
            tags: ['guildOnly'],
            aliases: ['gay'],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }
    async run(client, message,args){
        const guildData = client.getGuildData(message.guild.id);

    const color = guildData.color
    const lang = client.lang(guildData.lang)

    let member = message.mentions.users.first() || message.author

    let rng = Math.floor(Math.random() * 100)
    const gaydetectorembed = new Embed(client, guildData)
    .setAuthor({ name: lang.gaydetector.title, iconURL: client.user.displayAvatarURL() })
    .setDescription(`**${member.username}** est gay à ${rng}% 🏳️‍🌈`)

    message.reply({ embeds: [gaydetectorembed] })

    }
};

