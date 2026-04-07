const StateManager = require('../../utils/StateManager');

class MemberData {
    constructor(client, userId, guildId) {
        this.client = client;
        this.userId = userId;
        this.guildId = guildId;
        this.warns = [];
        this.invite = {join: 0, leave: 0, fake: 0, bonus: 0};
        this.inviter = null;
        this.coins = null;
        this.inventory = null;
        // this.fetchWarns()

        // this.fetchInvite()
        // this.fetchCoins()
        StateManager.on('coinsFetched', (emitGuildId, emitUserId, coins) => {
            if (emitGuildId !== this.guildId) return;
            if (emitUserId !== this.userId) return;
            this.coins = coins
        })
        StateManager.on('inventoryFetched', (emitGuildId, emitUserId, inventory) => {
            if (emitGuildId !== this.guildId) return;
            if (emitUserId !== this.userId) return;
            if (!inventory) return;
            this.inventory = inventory

        })
        StateManager.on('inviteFetched', (emitGuildId, emitUserId, invite) => {
            if (emitGuildId !== this.guildId) return;
            if (emitUserId !== this.userId) return;
            this.invite = invite
        })
        StateManager.on('warnFetched', (emitGuildId, emitUserId, warn) => {
            if (emitGuildId !== this.guildId) return;
            if (emitUserId !== this.userId) return;
            this.warns = warn ? warn.split(',') : []
        })


    }


    set updateInventory(inventory) {
        this.client.database.models.inventory.update({
            inventory
        }, {
            where: {
                userId: this.userId,
                guildId: this.guildId
            }
        }).then(() => this.inventory = inventory)
    }


    async createInventory(inventory) {
        console.log("create")
        this.client.database.models.inventory.create({
            inventory,
            userId: this.userId,
            guildId: this.guildId


        }).then(() => this.inventory = inventory)
    }

    async fetchCoins() {
        await this.client.database.models.guildConfig.findOne({
            where: {
                guildId: this.guildId
            }
        }).then(async res => {
            const {dataValues} = res;
            const {coinsOn} = dataValues;
            if (!coinsOn) return;
            await this.client.database.models.coins.findOrCreate({
                where: {
                    userId: this.userId,
                    guildId: this.guildId
                }
            }).then((res) => {
                const {dataValues} = res[0];
                const {coins} = dataValues;
                this.coins = coins

            })

            await this.client.database.models.inventory.findOne({
                where: {
                    userId: this.userId,
                    guildId: this.guildId
                }
            }).then((res) => {
                if (!res) return;
                const {dataValues} = res;
                let {inventory} = dataValues;
                if (!inventory) return;
                this.inventory = inventory

            })
        })
    }

    set updateCoins(coins) {
        this.client.database.models.coins.findOrCreate({
                where: {userId: this.userId, guildId: this.guildId},
            }
        ).then(res => {
            if (!res[0]._options.isNewRecord) {
                this.client.database.models.coins.update(
                    {
                        coins,
                    },
                    {
                        where: {
                            userId: this.userId,
                            guildId: this.guildId
                        }
                    })

            }
            this.coins = coins

        })

    }

    deleteWarn() {
        this.client.database.models.warn.destroy({
            where: {
                userId: this.userId,
                guildId: this.guildId
            }
        }).then(res => this.warns = [])
    }

    set updateWarn(warn) {
        this.client.database.models.warn.findOrCreate({
                where: {userId: this.userId, guildId: this.guildId},
                defaults: {warn: warn.toString()}
            }
        ).then(res => {
            if (!res[0]._options.isNewRecord) {
                this.client.database.models.warn.update({
                    warn: warn.toString()
                }, {
                    where: {
                        userId: this.userId,
                        guildId: this.guildId
                    }
                })


            }
            this.warns = warn

        })
    }

    set invitedBy(inviter) {
        this.client.database.models.invite.update({
            invitedBy: inviter
        }, {
            where: {
                userId: this.userId,
                guildId: this.guildId
            }
        }).then(() => {
            this.inviter = inviter
        })
    }

    set updateInvite(newInvite) {
        this.client.database.models.invite.update({
            count: newInvite
        }, {
            where: {
                userId: this.userId,
                guildId: this.guildId
            }
        }).then(() => {
            this.invite = newInvite
        })
    }

    clearMemberInvite(resetOnlyMember) {
        if (resetOnlyMember) {
            this.client.database.models.invite.update({
                count: {join: 0, leave: 0, fake: 0, bonus: 0},
            }, {
                where: {
                    guildId: this.guildId,
                    userId: this.userId
                }
            }).then(() => {
                this.invite = {join: 0, leave: 0, fake: 0, bonus: 0};
            })
        } else {
            this.invite = {join: 0, leave: 0, fake: 0, bonus: 0}
        }
    }

    async fetchWarns() {
        const warns = await this.client.database.models.warn.findOne({
            where: {
                guildId: this.guildId,
                userId: this.userId
            }
        }, {
            attributes: ['warn']
        })
        if (warns === null) return;
        this.warns = warns.dataValues.warn ? warns.dataValues.warn.split(',') : []
        console.log(`fetched ${this.userId} - Fetched warns`)
    }

    async fetchInvite() {
        const guildData = this.client.getGuildData(this.guildId);
        if (!guildData.config) return
        if (!guildData.config.inviteOn) return;

        await this.client.database.models.invite.findOrCreate({
            where: {userId: this.userId, guildId: this.guildId}
        }).then(res => {
            const {count, invitedBy} = res[0].dataValues;
            this.invite = count;
            this.inviter = invitedBy;
            console.log(`Fetch ${this.userId} - Fetched INVITES`)
        })
    }

}

module.exports = MemberData;
