const ms = require('ms');
const muteRoleId = new Map();
const logsChannelId = new Map();
const moment = require('moment')
const Command = require('../../structures/Handler/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'tempmute',
            description: 'Tempmute a members | Tempmute un membre',
            usage: 'tempmute <mention/id> <time>',
            category: 'moderation',
            userPermissions: [PermissionFlagsBits.MuteMembers],
            clientPermissions: [PermissionFlagsBits.MuteMembers],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang)
        let isSetup = message.guild.setup;
        if (!isSetup) return message.reply(lang.error.noSetup);

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply(lang.tempmute.errorNoMember);

        const muteRole = message.guild.roles.cache.get(guildData.config.muteRoleId);
        if (!muteRole) return message.reply(lang.tempmute.errorCantFindRole);

        const time = args[1];
        if (!time || isNaN(ms(time))) return message.reply(lang.tempmute.errorTime);

        if (member.roles.cache.has(muteRole.id)) return message.reply(lang.tempmute.errorAlreadyMute(member));
        member.roles.add(muteRole, `Mute by ${message.author.username}`).then(async () => {
            const color = guildData.color

            message.reply(lang.tempmute.success(member, time));

            const timeLenght = time.split('').length
            const numberT = parseInt(time.slice(0, timeLenght - 1))
            const dateF = time.split('')[timeLenght - 1].toString()
            const now = moment().utc()
            const muteEnd = now.add(numberT, dateF)

            try {
                await guildData.updateMute(member.id, true, muteEnd)
            } catch (err) {
                console.log(err)
            }
            const { logs } = lang
            const { modLog } = guildData.logs;
            const channel = message.guild.channels.cache.get(modLog);
            if(channel && !channel.deleted){
                channel.send(logs.mute(message.member, member.user, time, color, "tempmute"))
            }

        })


    }
};
