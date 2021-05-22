const StatusToken = require('./StatusToken');
const { CharacterStatus } = require('../Constants');

class HonoredStatusToken extends StatusToken {
    constructor(game, card) {
        super(game, card, CharacterStatus.Honored, 'Honored Token');
    }
}

module.exports = HonoredStatusToken;
