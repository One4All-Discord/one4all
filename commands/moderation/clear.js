const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'clear',
            description: 'Delete a number of message | Supprimer un nombre de messages',
            usage: 'clear <number>',
            category: 'moderation',
            userPermissions: [PermissionFlagsBits.ManageMessages],
            clientPermissions: [PermissionFlagsBits.ManageMessages],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const guildData = client.getGuildData(message.guild.id);
    const color = guildData.color
    const lang = client.lang(guildData.lang)

    let deleteAmount;

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.reply(lang.clear.errorNaN)}

    if (parseInt(args[0]) >= 101) {
        return message.reply(lang.clear.error100)
    } else {
        deleteAmount = parseInt(args[0]);
    }
    message.delete();
    let msg;
    message.channel.bulkDelete(deleteAmount + 1, true).then(async () =>{
        msg = await message.channel.send(lang.clear.success(deleteAmount))
        setTimeout(() =>{
            msg.delete();
        }, 5000)

    });
}}
