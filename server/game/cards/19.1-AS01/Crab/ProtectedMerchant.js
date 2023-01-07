const DrawCard = require('../../../drawcard.js');
const { Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class ProtectedMerchant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put 1 fate on this character',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.game.currentPhase === Phases.Dynasty
            },
            gameAction: AbilityDsl.actions.placeFate()
        });
    }
}

ProtectedMerchant.id = 'protected-merchant';

module.exports = ProtectedMerchant;
