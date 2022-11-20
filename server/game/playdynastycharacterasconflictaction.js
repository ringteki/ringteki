const { PlayTypes } = require('./Constants');
const PlayCharacterAction = require('./playcharacteraction');

class PlayDynastyAsConflictCharacterAction extends PlayCharacterAction {
    constructor(card, forceIntoConflict = true) {
        super(card, forceIntoConflict);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

module.exports = PlayDynastyAsConflictCharacterAction;
