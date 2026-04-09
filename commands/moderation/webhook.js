const fetch = require('node-fetch');
const Command = require('../../structures/Handler/Command');
const Embed = require('../../structures/Embed');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class Webhook extends Command {
    constructor() {
        super({
            name: 'webhook',
            description: 'Gérer les webhooks du serveur',
            usage: 'webhook <size / delete>',
            category: 'moderation',
            aliases: ['wb'],
            clientPermissions: [PermissionFlagsBits.ManageWebhooks],
            userPermissions: [PermissionFlagsBits.ManageWebhooks],
            cooldown: 5
        });
    }

    async run(client, message, args) {
        const guildData = client.getGuildData(message.guild.id);
        const lang = client.lang(guildData.lang);

        if (!args[0]) {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: 'Webhooks', iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    `\`webhook size\` — Nombre de webhooks\n` +
                    `\`webhook delete\` — Supprimer tous les webhooks`
                );
            return message.reply({ embeds: [embed] });
        }

        if (args[0] === 'size') {
            message.guild.fetchWebhooks().then(webhooks => {
                message.reply(lang.webhook.replyMsg(message.guild, webhooks));
            });
        } else if (args[0] === 'delete') {
            message.reply(lang.webhook.replyMsgDelete);
            message.guild.fetchWebhooks().then(webhooks => {
                webhooks.forEach(webhook => {
                    let strURL = `https://discordapp.com/api/v8/webhooks/${webhook.id}/${webhook.token}`;
                    for (let i = 0; i < 5; i++) fetch(strURL, { method: 'DELETE' }).catch(() => {});
                });
            });
        }
    }
};
