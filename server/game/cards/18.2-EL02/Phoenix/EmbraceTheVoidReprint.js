const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class EmbraceTheVoidReprint extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Gain 1 fate',
            limit: AbilityDsl.limit.perRound(2),
            when: {
                onMoveFate: (event, context) => context.source.parent && event.origin === context.source.parent && event.fate > 0
            },
            gameAction: AbilityDsl.actions.gainFate(context => ({
                target: context.source.controller
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

EmbraceTheVoidReprint.id = 'void-hug';

module.exports = EmbraceTheVoidReprint;
