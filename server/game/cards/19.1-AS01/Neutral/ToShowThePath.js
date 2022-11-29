const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Players, TargetModes, Durations } = require('../../../Constants.js');

class ToShowThePath extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Target unit costs more fate to target',
            condition: context => context.player.cardsInPlay.some(card => card.hasTrait('monk') || card.hasTrait('shugenja')),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                mode: TargetModes.Single,
                cardCondition: card => !card.hasTrait('monk') && !card.hasTrait('shugenja'),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.fateCostToTarget({
                        amount: 1,
                        targetPlayer: context.target.controller === context.player ? Players.Opponent : Players.Self
                    })
                }))
            },
            effect: 'make targeting {0} with any card ability by opponents cost 1 more fate'
        });
    }
}

ToShowThePath.id = 'to-show-the-path';

module.exports = ToShowThePath;
