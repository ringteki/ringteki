const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class CherishedFamilyServant extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.getType() === CardTypes.Attachment && card.hasTrait('poison') && card.parent && context.source.controller === card.parent.controller,
            effect: AbilityDsl.effects.addKeyword('ancestral'),
            targetController: Players.Any
        });

        this.persistentEffect({
            location: Locations.Any,
            targetLocation: Locations.Any,
            effect: AbilityDsl.effects.entersPlayForOpponent()
        });
    }
}

CherishedFamilyServant.id = 'cherished-family-servant';

module.exports = CherishedFamilyServant;
