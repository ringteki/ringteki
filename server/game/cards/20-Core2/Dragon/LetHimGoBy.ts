import { AbilityTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class LetHimGoBy extends DrawCard {
    static id = 'let-him-go-by';

    public setupCardAbilities() {
        this.reaction({
            title: 'Make opponent discard a card',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.context.ability.abilityType === AbilityTypes.DuelReaction &&
                    event.context.player === context.player.opponent
            },
            gameAction: AbilityDsl.actions.discardAtRandom((context) => ({
                target: context.player.opponent,
                amount: 1
            })),
            max: AbilityDsl.limit.perDuel(1)
        });

        this.reaction({
            title: 'Bow a character',
            when: {
                onMoveToConflict: (event, context) =>
                    context.player.opponent && event.card.controller === context.player.opponent,
                onCardPlayed: (event, context) =>
                    context.player.opponent &&
                    event.card.controller === context.player.opponent &&
                    event.card.isParticipating()
            },
            gameAction: AbilityDsl.actions.bow((context) => ({
                target: (context as any).event.card
            }))
        });
    }
}