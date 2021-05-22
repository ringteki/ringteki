const StatusToken = require('./StatusToken');
const { CharacterStatus } = require('../Constants');

class DishonoredStatusToken extends StatusToken {
    constructor(game, card) {
        super(game, card, CharacterStatus.Dishonored, 'Dishonored Token');
    }
}

module.exports = DishonoredStatusToken;
