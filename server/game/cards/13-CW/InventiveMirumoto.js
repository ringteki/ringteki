const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class InventiveMirumoto extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play attachment onto this character',
            condition: context => context.game.rings.water.isConsideredClaimed(context.player),
            target: {
                cardCondition: card => card.type === CardTypes.Attachment,
                location: Locations.ConflictDiscardPile,
                gameAction: AbilityDsl.actions.playCard(context => ({
                    payCosts: true,
                    playCardTarget: attachContext => {
                        attachContext.target = context.source;
                        attachContext.targets.target = context.source;
                    }

                }))
            },
            effect: 'play {0} onto {1}',
            effectArgs: context => [context.target, context.source]
        });
    }
}

InventiveMirumoto.id = 'inventive-mirumoto';

module.exports = InventiveMirumoto;
