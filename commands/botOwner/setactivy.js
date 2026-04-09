const { PermissionFlagsBits, ActivityType } = require('discord.js');

const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setactivity',
            description: 'defininr activite',
            usage: 'setactivity',
            category: 'botOwner',
            ownerOnly: true,
            clientPermissions: [PermissionFlagsBits.EmbedLinks],
            cooldown: 10
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);


        const color = guildData.color
        const activityName = args.join(" ");
        if (args[0] === "streaming") {
            client.user.setPresence({
                activities: [{
                    name: activityName.replace("streaming", " "),
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/discord"
                }]
            })
                .then(p => message.reply(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("streaming", " ")}\`.`))
                .catch(e => {
                    return message.reply(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });


        } else if (args[0] === "playing") {
            client.user.setPresence({activities: [{name: activityName.replace("playing", " "), type: ActivityType.Playing}]})
                .then(p => message.reply(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("playing", " ")}\`.`))
                .catch(e => {
                    return message.reply(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });
        } else if (args[0] === "watching") {
            client.user.setPresence({activities: [{name: activityName.replace("watching", " "), type: ActivityType.Watching}]})
                .then(p => message.reply(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("watching", " ")}\`.`))
                .catch(e => {
                    return message.reply(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });
        } else if (!args[0]) {
            message.reply(`${message.author}, Vous avez fournie aucune valeur pour l'activité`);

        } else if (args[0] && !args[1]) {
            message.reply(`${message.author}, Vous avez fournie aucune valeur pour le nom de l'activié`);

        }

    }
};

