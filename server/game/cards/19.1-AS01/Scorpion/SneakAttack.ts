import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class SneakAttack extends DrawCard {
    static id = 'sneak-attack';

    public setupCardAbilities() {
        this.reaction({
            title: 'The attacker gets the first action opportunity',
            cost: AbilityDsl.costs.payHonor(1),
            when: {
                onConflictStarted: (event, context) => event.conflict.attackingPlayer === context.player
            },
            effect: 'give {1} the first action in this conflict{2}',
            effectArgs: (context) => [
                context.player,
                context.player.opponent.hand.size() > 0 ? " and peak at their opponent's hand" : ''
            ],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.lookAt((context) => ({
                    target: context.player.opponent.hand
                        .shuffle()
                        .slice(0, 2)
                        .sort((a: BaseCard, b: BaseCard) => a.name.localeCompare(b.name)),
                    message: "{0} sees {1} in {2}'s hand",
                    messageArgs: (cards) => [context.player, cards, context.player.opponent]
                })),
                AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: AbilityDsl.effects.gainActionPhasePriority()
                }))
            ])
        });
    }
}
