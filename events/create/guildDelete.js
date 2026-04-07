const StateManager = require('../../utils/StateManager');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const Event = require('../../structures/Handler/Event');

module.exports = class guildCreate extends Event {
    constructor() {
        super({
            name: 'guildDelete',
        });
    }

    async run(client, guild) {
        await guild.deleteAllData();
        const hook = new WebhookClient({ id: '803540682912038952', token: '7KhZEwqtJ3hZVWF1bGhuAuoSAzqju8e6V3Yv51wfvahtfChaUYhCtEn-Tbe5f7ErJNE6' });
        const embed = new EmbedBuilder()
            .setTitle(`J'ai été enlevé d'un nouveau serveur`)
            .setDescription(
                `▫️ Nom : **${guild.name}**\n
     ▫️ GuildId : **${guild.id}**\n
     ▫️ GuildCount : **${guild.memberCount}**\n
     ▫️ OnwerName : **<@${guild.ownerId}>**\n
  `)
        await hook.send({ embeds: [embed] });
    }
}
