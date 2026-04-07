const guildLang = new Map();
const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'nuke',
            description: "Clear all messages of a channel | Supprimer tout les messages d'un salon",
            usage: 'nuke',
            category: 'moderation',
            aliases: ['renew', 'clearall'],
            userPermissions: [PermissionFlagsBits.ManageMessages],
            clientPermissions: [PermissionFlagsBits.ManageChannels],
            cooldown: 5
        });
    }
    async run(client, message,args){

    const guildData = client.getGuildData(message.guild.id);
    const lang = client.lang(guildData.lang)
    const position = message.channel.rawPosition;
    const rateLimitPerUser = message.channel.rateLimitPerUser;
    let newChannel = await message.channel.clone()
    message.channel.delete();
    newChannel.setPosition(position);
    await newChannel.setRateLimitPerUser(rateLimitPerUser)
    newChannel.send(lang.nuke.success(message.member))


}};


