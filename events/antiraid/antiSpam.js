const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType, Collection } = require('discord.js');
const Event = require('../../structures/Handler/Event');
const LIMIT = 5;
const TIME = 7000;
const DIFF = 3000;
const spammer = new Collection()
module.exports = class Message extends Event{
    constructor() {
        super({
            name: 'messageCreate',
        });
    }
    async run(client, message){
        if (message.guild == null) return;
        if(message.webhookId) return;
        const guildData = client.getGuildData(message.guild.id);
        if (!guildData.config) return;
        const { muteRoleId } = guildData.config;
        const muteRole = message.guild.roles.cache.get(muteRoleId);
        if(!muteRoleId || !muteRole || muteRole.deleted || muteRole.managed) return;
        const color = guildData.color;
        const antiraidConfig = guildData.antiraid;
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)
        const isOn = antiraidConfig.enable["antiSpam"];
        if(!isOn) return;


        if (message.author.id === client.user.id) return
        if(message.guild.ownerId === message.author.id) return

        let isGuildOwner = message.guild.isGuildOwner(message.author.id);
        let isBotOwner = client.isOwner(message.author.id);


        let isWlBypass = antiraidConfig.bypass["antiSpam"];
        if (isWlBypass) var isWl = message.guild.isGuildWl(message.author.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`} - CHANNEL CREATE`);


        if (isWlBypass && !isWl || !isWlBypass) {
            const { member } = message;

            if (spammer.has(`${message.guild.id}-${message.author.id}`)) {
                const userData = spammer.get(`${message.guild.id}-${message.author.id}`);
                const {lastMessage, timer} = userData;
                const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                let msgCount = userData.msgCount;
                if (difference > DIFF) {
                    clearTimeout(timer);
                    // console.log("Clear timeout");

                    userData.msgCount = 1;
                    userData.lastMessage = message;
                    userData.timer = setTimeout(() => {
                        spammer.delete(`${message.guild.id}-${message.author.id}`);
                        // console.log('removed from reset')

                    }, TIME)
                    spammer.set(`${message.guild.id}-${message.author.id}`, userData)
                } else {
                    ++msgCount;
                    if (parseInt(msgCount) === LIMIT) {
                        await member.roles.add(muteRole);
                        message.channel.send(`${message.member}, vous avez été mute car vous spammez`)
                        const channel = message.guild.channels.cache.get(antiraidLog);
                        if(channel && !channel.deleted) channel.send(logs.antiSpam(message.member, message.channel.id, color, 'mute'))
                    } else {
                        userData.msgCount = msgCount;
                        spammer.set(`${message.guild.id}-${message.author.id}`, userData);
                    }
                }
            } else {
                let fn = () => setTimeout(() => {
                    spammer.delete(`${message.guild.id}-${message.author.id}`);
                    // console.log('removed from map')

                }, TIME)
                spammer.set(`${message.guild.id}-${message.author.id}`, {
                    msgCount: 1,
                    lastMessage: message,
                    timer: fn
                });

            }
        }
    }
}
