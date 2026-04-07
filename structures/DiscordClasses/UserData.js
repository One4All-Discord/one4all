const StateManager = require('../../utils/StateManager');

class UserData {
    constructor(client, userId, username, isBot) {
        this.client = client;
        this.userId = userId;
        this.username = username;
        this.bot = isBot;
        if (this.bot) return;
        this.blacklist = null;
        this.playlists = null;
        this.blFetched = false;
        // this.fetchBlacklistedUsers();
    }

    get playlist() {
        return this.playlists;
    }

    async updateBlacklist(newArray) {
        await this.client.database.models.blacklist.update({
            isOn: newArray.enable,
            blacklisted: newArray.blacklisted.toString()
        }, {where: {userId: this.userId}}).then((res) => {
            console.log(`Update ${this.username} - BLACKLIST`)
            this.blacklist = {
                enable: newArray.enable,
                blacklisted: newArray.blacklisted
            }
            return this.blacklist


        })
    }


    async initBlacklist(enable) {
        await this.client.database.models.blacklist.create({
            userId: this.userId,
            isOn: enable
        }).then((res) => {
            console.log(`Created ${this.username} - BLACKLIST`)
            const config = res.dataValues;

            this.blacklist = {
                enable: config.isOn,
                blacklisted: config.blacklisted ? config.blacklisted.split(',') : []
            }
        }).catch(err => console.log(err))
        return this.blacklist

    }

    async fetchBlacklistedUsers() {
        if (this.blFetched) return
        await this.client.database.models.blacklist.findOne({
            where: {
                userId: this.userId
            }
        }).then((res) => {
            if (res === null) return;
            const config = res.dataValues;
            this.blacklist = {
                enable: config.isOn,
                blacklisted: config.blacklisted ? config.blacklisted.split(',') : []
            }
            this.blFetched = true;
            console.log(`Fetched ${this.username} - BLACKLIST`)
        })
    }


    async createBackup(backupId, guildName, guildData) {
        await this.client.database.models.backup.create({
            backupId,
            guildData,
            guildName,
            userId: this.userId
        }).then((res) => {
            if (res) {
                console.log(`Create ${this.username} : ${backupId} - BACKUP`)
                return true
            } else {
                return false
            }
        })
    }

    async getBackup(backupId) {
        const backup = await this.client.database.models.backup.findOne({where: {backupId}})
        if (!backup) return null
        console.log(backup)
        return backup.get()
    }

    async deleteBackup(backupId) {

        const res = await this.client.database.models.backup.destroy({
            where: {
                backupId,
                userId: this.userId
            }
        })
        if (res === 1) {
            console.log(`Destroy ${this.username} : ${backupId} - BACKUP`)
            return true
        } else {
            return false
        }
    }

    async fetchPlaylist() {
        const record = await this.client.database.models.playlist.findOne({
            where: { userId: this.userId }
        });
        if (record) {
            this.playlists = record.get('playlist');
        }
    }
}

module.exports = UserData;
