const { EmbedBuilder } = require('discord.js');

const Colors = {
    DEFAULT: '#8B5CF6',
    SUCCESS: '#10B981',
    ERROR: '#EF4444',
    WARNING: '#F59E0B',
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
            this.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() });
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

    setRequestedBy(user) {
        this.setFooter({ text: `Demandé par ${user.username}`, iconURL: user.displayAvatarURL() });
        return this;
    }
}

Embed.Colors = Colors;

module.exports = Embed;
