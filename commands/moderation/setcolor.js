const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits } = require('discord.js');
let hexColorRegex = require('hex-color-regex');

module.exports = class SetColor extends Command {
    constructor() {
        super({
            name: 'setcolor',
            description: 'Changer la couleur des embeds',
            usage: 'setcolor <#hex>',
            category: 'moderation',
            clientPermissions: [PermissionFlagsBits.SendMessages],
            guildOwnerOnly: true,
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);

        const color = args[0];
        if (!color) return message.reply(lang.setcolor.noColor);
        if (!hexColorRegex().test(color)) return message.reply(lang.setcolor.errorNoArgs);

        try {
            guildData.updateColor = color;
            guildData.color = color;

            const embed = new Embed(client, guildData)
                .setColor(color)
                .setAuthor({ name: 'Couleur mise à jour', iconURL: client.user.displayAvatarURL() })
                .setDescription(`Nouvelle couleur : \`${color}\``);
            message.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            message.reply(lang.setcolor.errorSql(color));
        }
    }
};
