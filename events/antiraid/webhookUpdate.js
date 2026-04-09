const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent, ChannelType } = require('discord.js');
const Event = require('../../structures/Handler/Event');

module.exports = class webhookUpdate extends Event {
    constructor() {
        super({
            name: 'webhookUpdate',
        });
    }

    async run(client, channel) {
        let guild = channel.guild

        const guildData = client.getGuildData(guild.id);
        const color = guildData.color
        let {antiraidLog} = guildData.logs;
        let {logs} = client.lang(guildData.lang)


        const antiraidConfig = guildData.antiraid;
        const isOn = antiraidConfig.enable[this.name];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({
            type: AuditLogEvent.WebhookUpdate,
            limit: 1
        }).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return console.log(`No sanction oneforall - ${this.name}`);
        if (guild.ownerId === action.executor.id) return console.log(`No sanction crown - ${this.name}`);

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return console.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`} - wb update`);
        if (isWlBypass && !isWl || !isWlBypass) {
            const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)
            try {
                await channel.delete(`OneForAll - Type : webhookCreate`);
                var newChannel = await channel.clone({
                    reason: `OneForAll - Type : webhookCreate`,
                    parent: channel.parent
                })
                await newChannel.setPosition(channel.rawPosition)

                if(newChannel){
                    const embed = new EmbedBuilder()
                        .setDescription('Une creation de webhook a ete detecte le channel a donc ete renew [oneforall antiraid](https://discord.gg/TfwGcCjyfp)')
                        .setColor(color)
                        .setTimestamp()
                        .setFooter({ text: client.user.username })
                    newChannel.send({ embeds: [embed] })
                }


            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if(logsChannel && newChannel){
                        logsChannel.send(logs.webhookCreate(executor, newChannel.id, color, "Je n'ai pas assé de permissions"))
                    }
                }
            }

            let sanction = antiraidConfig.config[this.name];

            if (executor.roles.highest.comparePositionTo(guild.members.me.roles.highest) <= 0) {
                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: `OneForAll - webhookCreate`})


                } else if (sanction === 'kick') {
                    executor.kick(
                        `OneForAll - Type: webhookCreate `
                    )


                } else if (sanction === 'unrank') {

                    let roles = []
                     await executor.roles.cache
                        .map(role => roles.push(role.id))

                    await executor.roles.remove(roles, `OneForAll - Type: webhookCreate`)
                    if (action.executor.bot) {
                        let botRole = executor.roles.cache.filter(r => r.managed)
                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0n, `OneForAll - Type: webhookCreate`)
                    }


                }

                if(logsChannel && newChannel) {
                    logsChannel.send(logs.webhookCreate(executor, newChannel.id, color,sanction))
                }
            } else {
                if(logsChannel && newChannel){
                    logsChannel.send(logs.webhookCreate(executor, newChannel.id, color, "Je n'ai pas assé de permissions"))
                }
            }
        }
    }
}
