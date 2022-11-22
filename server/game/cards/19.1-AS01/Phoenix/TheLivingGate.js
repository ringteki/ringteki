const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class TheLivingGate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                this.controllerHasShugenjaAtSameLocation(context),
            effect: AbilityDsl.effects.cardCannot({ cannot: 'leavePlay' })
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context) =>
                    !this.controllerHasShugenjaAtSameLocation(context),
                message:
                    '{0} is discarded from play because {1} controls no Shugenja at their location',
                messageArgs: (context) => [context.source, context.player],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });
    }

    controllerHasShugenjaAtSameLocation(context) {
        return context.player.anyCardsInPlay(
            (otherCard) =>
                otherCard.type === CardTypes.Character &&
                otherCard.hasTrait('shugenja') &&
                context.source.isInConflict() === otherCard.isInConflict()
        );
    }
}

TheLivingGate.id = 'the-living-gate';

module.exports = TheLivingGate;
