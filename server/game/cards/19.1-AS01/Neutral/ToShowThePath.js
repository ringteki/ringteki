const AbilityDsl = require('../../../abilitydsl');
const DrawCard = require('../../../drawcard.js');
const { CardTypes, Durations, Players, TargetModes } = require('../../../Constants.js');

class ToShowThePath extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Target unit costs more fate to target',
            condition: (context) =>
                context.player.cardsInPlay.some((card) => card.hasTrait('monk') || card.hasTrait('shugenja')),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                mode: TargetModes.Single,
                cardCondition: (card) => !card.hasTrait('monk') && !card.hasTrait('shugenja'),
                gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player.opponent,
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.playerFateCostToTargetCard({
                        amount: 1,
                        targetPlayer: context.target.controller === context.player ? Players.Opponent : Players.Self,
                        match: (card) =>
                            card === context.target ||
                            context.target.attachments.some((attachment) => attachment === card)
                    })
                }))
            },
            effect: 'make {1} pay 1 additional fate as a cost whenever they target {0} or its attachments with a card ability until the end of the phase',
            effectArgs: (context) => [context.source.controller.opponent]
        });
    }
}

ToShowThePath.id = 'to-show-the-path';

module.exports = ToShowThePath;
