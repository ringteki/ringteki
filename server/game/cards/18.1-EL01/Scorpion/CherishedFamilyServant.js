const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes, Players, Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class CherishedFamilyServant extends DrawCard {
    setupCardAbilities() {
        this.dire({
            match: (card, context) => card.getType() === CardTypes.Attachment && card.hasTrait('poison') && card.parent && context.source.controller === card.parent.controller,
            effect: AbilityDsl.effects.addKeyword('ancestral'),
            targetController: Players.Any
        });

        this.persistentEffect({
            condition: context => this.game.currentPhase === Phases.Fate && !context.source.isDishonored,
            effect: [
                AbilityDsl.effects.cardCannot('removeFate'),
                AbilityDsl.effects.cardCannot('discardFromPlay')
            ]
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
