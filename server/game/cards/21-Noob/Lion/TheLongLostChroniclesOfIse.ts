import { CardTypes, Players, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TheLongLostChroniclesOfIse extends DrawCard {
    static id = 'the-long-lost-chronicles-of-ise';

    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (_, player) =>
                    player.cardsInPlay.some(
                        (card) => card.getType() === CardTypes.Character && card.hasTrait('storyteller')
                    )
                        ? 1
                        : 0,
                match: (card, source) => card === source
            })
        });

        this.reaction({
            title: 'Steal honor for each action',
            when: {
                onCardAttached: (event, context) =>
                    context.game.isDuringConflict() &&
                    event.card === context.source &&
                    event.originalLocation !== Locations.PlayArea
            },
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player.opponent,
                effect: AbilityDsl.effects.additionalPlayCost((context) =>
                    context.source.type === CardTypes.Event ? [AbilityDsl.costs.giveHonorToOpponent(1)] : []
                )
            })),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
