const { EmbedBuilder } = require('discord.js');

const Colors = {
    DEFAULT: '#2ECC71',
    SUCCESS: '#2ECC71',
    ERROR: '#E74C3C',
    WARNING: '#F39C12',
    INFO: '#3498DB',
    MUTE: '#95A5A6',
};

class Embed extends EmbedBuilder {
    /**
     * @param {import('./Client/OneForAll')} client
     * @param {object} [guildData] - GuildData instance
     */
    constructor(client, guildData) {
        super();
        this.setColor(guildData?.color || Colors.DEFAULT);
        this.setTimestamp();
        if (client?.user) {
            this.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });
        }
    }

    setSuccess() {
        this.setColor(Colors.SUCCESS);
        return this;
    }

    setError() {
        this.setColor(Colors.ERROR);
        return this;
    }

    setWarning() {
        this.setColor(Colors.WARNING);
        return this;
    }

    setInfo() {
        this.setColor(Colors.INFO);
        return this;
    }

    setRequestedBy(user) {
        this.setFooter({ text: `Demandé par ${user.username}`, iconURL: user.displayAvatarURL() });
        return this;
    }
}

Embed.Colors = Colors;

module.exports = Embed;
