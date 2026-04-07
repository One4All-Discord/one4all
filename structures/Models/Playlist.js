module.exports = (Sequelize, oneforall) => {
    try {
        oneforall.database.define('playlist', {
            userId: {
                type: Sequelize.STRING(100),
                primaryKey: true,
                allowNull: false
            },
            playlist: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
                defaultValue: '[]',
                get: function () {
                    const raw = this.getDataValue('playlist');
                    try {
                        return JSON.parse(raw);
                    } catch {
                        return [];
                    }
                },
                set: function (value) {
                    return this.setDataValue('playlist', JSON.stringify(value));
                },
            }
        });
        return oneforall.database.models;

    } catch (e) {
        console.log(e);
    }
};
