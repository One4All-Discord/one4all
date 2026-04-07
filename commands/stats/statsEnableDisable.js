const { PermissionFlagsBits } = require('discord.js');
const StateManager = require('../../utils/StateManager');
const Command = require('../../structures/Handler/Command');

module.exports = class StatsEnableDisable extends Command {
    constructor() {
        super({
            name: 'stats',
            description: 'Enable or disable stats | Activer ou désactiver les stats',
            usage: 'stats <on/off>',
            category: 'stats',
            userPermissions: [PermissionFlagsBits.Administrator],
            cooldown: 3
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        this.connection = StateManager.connection;
        const lang = client.lang(guildData.lang);
        if (args[0] === "on") {
            await this.connection.query(`UPDATE guildConfig SET statsOn = '1' WHERE guildId = '${message.guild.id}'`).then(() => {
                message.channel.send(lang.stats.enable).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
                StateManager.emit('statsOnU', message.guild.id, '1');
            });
        } else if (args[0] === "off") {
            await this.connection.query(`UPDATE guildConfig SET statsOn = '0' WHERE guildId = '${message.guild.id}'`).then(() => {
                message.channel.send(lang.stats.disable).then(mp => setTimeout(() => mp.delete().catch(() => {}), 4000));
            });
            StateManager.emit('statsOnU', message.guild.id, '0');
        }
    }
};
