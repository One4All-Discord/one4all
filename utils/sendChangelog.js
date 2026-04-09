const fetch = require('node-fetch');

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1491626874735169577/RHM588YShuzgSUzzMaD8MHzezTSpAnZ8id1n14kjzJTgFR9mgvyNes5bY4Q2Jat2J6WG';
const CHANNEL_ID = '1491552240539013303';

/**
 * Send a changelog embed to the Discord webhook and react with 📄
 * @param {string} title - Embed title
 * @param {string} description - Embed description (markdown)
 * @param {string} botToken - Bot token for reacting
 */
async function sendChangelog(title, description, botToken) {
    const res = await fetch(WEBHOOK_URL + '?wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                title,
                color: 0x2ECC71,
                description,
                footer: { text: 'One4All • Changelog' },
                timestamp: new Date().toISOString()
            }]
        })
    });

    const msg = await res.json();

    if (msg.id && botToken) {
        await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages/${msg.id}/reactions/%F0%9F%93%84/@me`, {
            method: 'PUT',
            headers: { 'Authorization': `Bot ${botToken}` }
        });
    }

    return msg;
}

module.exports = sendChangelog;
