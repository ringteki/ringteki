const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class ThereAreNoSecrets extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Gain 1 fate',
            limit: AbilityDsl.limit.perRound(2),
            max: AbilityDsl.limit.perRound(3),
            when: {
                onMoveFate: (event, context) => context.source.parent && event.origin === context.source.parent && event.fate > 0
            },
            gameAction: AbilityDsl.actions.gainFate(context => ({
                target: context.player
            }))
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

ThereAreNoSecrets.id = 'there-are-no-secrets';

module.exports = ThereAreNoSecrets;
