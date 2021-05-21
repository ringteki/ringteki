const StatusToken = require('./StatusToken');
const { CharacterStatus } = require('../Constants');

class TaintedStatusToken extends StatusToken {
    constructor(game, card) {
        super(game, card, CharacterStatus.Tainted, 'Tainted Token');
    }
}

module.exports = TaintedStatusToken;
