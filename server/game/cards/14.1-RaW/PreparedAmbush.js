const BattlefieldAttachment = require('../BattlefieldAttachment');
const AbilityDsl = require('../../abilitydsl');
const PlayCharacterAction = require('../../playcharacteraction');
const { Locations, PlayTypes } = require('../../Constants');

class PreparedAmbushPlayAction extends PlayCharacterAction {
    constructor(card) {
        super(card, true);
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

class PreparedAmbush extends BattlefieldAttachment {
    setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            condition: context => context.game.isDuringConflict() && context.source.parent.isConflictProvince(),
            targetLocation: Locations.Provinces,
            match: card => card.isDynasty && card.isFaceup(),
            effect: AbilityDsl.effects.gainPlayAction(PreparedAmbushPlayAction)
        });
    }
}

PreparedAmbush.id = 'prepared-ambush';

module.exports = PreparedAmbush;
