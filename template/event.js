const Event = require('../../structures/Handler/Event');

module.exports = class NomEvent extends Event {
    constructor() {
        super({
            name: '',
        });
    }

    async run(client, ...args) {

    }
};
