const Event = require('../../structures/Handler/Event');
const Embed = require('../../structures/Embed');

module.exports = class InteractionCreate extends Event {
    constructor() {
        super({
            name: 'interactionCreate',
        });
    }

    async run(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'ping') {
            const guildData = interaction.guild ? client.getGuildData(interaction.guild.id) : null;

            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Pong !', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    { name: 'Latence', value: `\`${Date.now() - interaction.createdTimestamp}ms\``, inline: true },
                    { name: 'API Discord', value: `\`${Math.round(client.ws.ping)}ms\``, inline: true },
                );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
