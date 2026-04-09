require('dotenv').config();

module.exports = {
    token: process.env.TOKEN,
    prefix: '-',
    database: {
        user: process.env.DB_USER || 'root',
        name: process.env.DB_NAME || 'oneforall',
        password: process.env.DB_PASS || ''
    },
    color: '#2ECC71',
    owners: (process.env.OWNERS || '').split(',').filter(Boolean),
    botperso: process.env.BOT_PERSO === 'true',
    topGgToken: process.env.TOPGG_TOKEN || '',
    devLogChannel: process.env.DEV_LOG_CHANNEL || '',
};
