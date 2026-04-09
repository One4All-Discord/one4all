const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType, Collection } = require('discord.js');
const Event = require('../../structures/Handler/Event');

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
        const color = guildData.color;
        const antiraidConfig = guildData.antiraid;
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)
        const isOn = antiraidConfig.enable["antiLink"];
        if(!isOn) return;


        if (message.author.id === client.user.id)  return
        if(message.guild.ownerId === message.author.id) return

        let isGuildOwner = message.guild.isGuildOwner(message.author.id);
        let isBotOwner = client.isOwner(message.author.id);


        let isWlBypass = antiraidConfig.bypass["antiLink"];
        if (isWlBypass) var isWl = message.guild.isGuildWl(message.author.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`} - CHANNEL CREATE`);


        if (isWlBypass && !isWl || !isWlBypass) {
            const { member } = message;
            const channel = message.guild.channels.cache.get(antiraidLog);
            let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
            let reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
            if(reg.test(message.content) || discordInvite.test(message.content)){
                if(message.deletable) message.delete().catch(e => {})
                let msg = `${message.author}, vous n'êtes pas autorisé à poster des liens`
                let embed = new EmbedBuilder()
                    .setColor(color)
                    .setDescription(msg);
                message.channel.send({ embeds: [embed] }).then(m => setTimeout(() => m.delete().catch(() => {}), 2000))
                if(channel && !channel.deleted){
                    return channel.send(logs.antiLink(member, message.channel.id, message.content, color, 'delete'))
                }
                if(!muteRoleId || !muteRole || muteRole.deleted || muteRole.managed) return;

                if(!spammer.has(`${message.guild.id}-${message.author.id}`)) {
                    spammer.set(`${message.guild.id}-${message.author.id}`, 1)
                }else{
                    const data = spammer.get(`${message.guild.id}-${message.author.id}`)
                    spammer.set(`${message.guild.id}-${message.author.id}`, data + 1);
                }
                if(spammer.get(`${message.guild.id}-${message.author.id}`) > 5){
                    const { muteRoleId } = guildData.config;
                    const muteRole = message.guild.roles.cache.get(muteRoleId);
                    if(!muteRoleId || !muteRole || muteRole.deleted || muteRole.managed) return;
                    await message.member.roles.add(muteRole, `Oneforall - anti spam link`)
                    message.channel.send(`Vous avez été mute car vous postez trop de lien`)
                    if(channel && !channel.deleted){
                        return channel.send(logs.antiLink(member, message.channel.id, message.content, color, 'mute'))
                    }
                }


            }
        }
    }
}
