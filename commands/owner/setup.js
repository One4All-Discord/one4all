const { ChannelType } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setup',
            description: 'Setup the role for the bot to work perfectly | Configurer les rôles indispensable pour la fonctionnalitée du bot',
            usage: 'setup',
            category: 'owners',
            guildOwnerOnly: true,
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);


        const lang = client.lang(guildData.lang)


        message.reply(lang.setup.muteQ)
        const responseMuteRole = await message.channel.awaitMessages({ filter: m => m.author.id === message.author.id,
            max: 1,
            time: 30000
        }).catch(() => {
            message.reply("Opération annulée pas de réponse après 30s")
        })
        if (!responseMuteRole || !responseMuteRole.first()) return;
        const CollectedMuteRole = responseMuteRole.first()
        if (CollectedMuteRole.content.toLowerCase() === "cancel") return message.reply(lang.cancel)


        message.reply(lang.setup.memberRoleQ)
        const responseMembreRole = await message.channel.awaitMessages({ filter: m => m.author.id === message.author.id,
            max: 1,
            time: 30000
        }).catch(() => {
            message.reply("Opération annulée pas de réponse après 30s")
        })
        if (!responseMembreRole || !responseMembreRole.first()) return;
        const CollectedMembreRole = responseMembreRole.first()
        if (CollectedMembreRole.content.toLowerCase() === "cancel") return message.reply(lang.cancel)


        let muteRole = CollectedMuteRole.mentions.roles.first() || message.guild.roles.cache.get(CollectedMuteRole.content);
        let muteRoleId = muteRole.id;
        if(!muteRole) return  message.reply(lang.setup.dontFindMute)

        let memberRole = CollectedMembreRole.mentions.roles.first() || message.guild.roles.cache.get(CollectedMembreRole.content);
        let memberRoleId = memberRole.id
        if(!memberRole) return message.reply(lang.setup.dontFindMember)

        try {

            await guildData.updateSetup(muteRoleId, memberRoleId)
            message.reply(lang.setup.success(muteRoleId, memberRoleId))
            message.guild.channels.cache.forEach(channel => {
                if (channel.type === ChannelType.GuildText) {
                    channel.permissionOverwrites.edit(muteRole, {
                        SendMessages: false,
                        AddReactions: false
                    }, `Setup par ${message.author.username}`)
                }
                if (channel.type === ChannelType.GuildVoice) {
                    channel.permissionOverwrites.edit(muteRole, {
                        Speak: false
                    }, `Setup par ${message.author.username}`)
                }
            })
        } catch (err) {
            console.log(err)
            message.reply(lang.setup.error(muteRoleId, memberRole))
        }
    }
}
