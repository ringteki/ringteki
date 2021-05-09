const TaintedStatusToken = require('./TaintedStatusToken');
const HonoredStatusToken = require('./HonoredStatusToken');
const DishonoredStatusToken = require('./DishonoredStatusToken');
const { CharacterStatus } = require('../Constants');

const GetStatusToken = (game, card, tokenType) => {
    if (tokenType === CharacterStatus.Tainted) {
        return new TaintedStatusToken(game, card);
    }
    if (tokenType === CharacterStatus.Honored) {
        return new HonoredStatusToken(game, card);
    }
    if (tokenType === CharacterStatus.Dishonored) {
        return new DishonoredStatusToken(game, card);
    }
    return undefined;
}

module.exports = GetStatusToken;