const { PermissionFlagsBits, Util } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'removeemoji',
            description: 'Remove an emoji | Supprimer un emoji',
            usage: 'removeemoji <emoji>',
            category: 'misc',
            aliases: ['remove', 'emojiremove', 'rmemoji'],
            userPermissions: [PermissionFlagsBits.ManageGuild],
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 5

        });
    }
    async run(client, message,args){
        const guildData = client.getGuildData(message.guild.id);
    const color = guildData.color
    const lang = client.lang(guildData.lang)
    const emoji = args[0];
    let custom = Util.parseEmoji(emoji);

    if (!emoji) {
        return message.channel.send(lang.removeemoji.missingUrl);
    }

    if (custom.id) {
        message.guild.emojis.resolve(custom.id).delete(`Remove emoji par ${message.author.username}`).then(()=>{
            message.channel.send(lang.removeemoji.success(custom.name))

        }).catch(err => {
            message.channel.send(lang.removeemoji.error(custom.name))
        });

    }
  
}}

