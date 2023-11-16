import { CardTypes, Players, Durations, DuelTypes, AbilityTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class LetHimGoBy extends DrawCard {
    static id = 'let-him-go-by';

    private getAttachmentSkill(card, context) {
        let amount = 0;
        if (context.game.currentDuel.duelType === DuelTypes.Military) {
            amount = parseInt(card.cardData.military_bonus);
        } else if (context.game.currentDuel.duelType === DuelTypes.Political) {
            amount = parseInt(card.cardData.political_bonus);
        }

        return isNaN(amount) ? 0 : amount;
    }

    public setupCardAbilities() {
        this.reaction({
            title: 'Make opponent discard a card',
            when: {
                onInitiateAbilityEffects: (event, context) => (event.context.ability.abilityType === AbilityTypes.DuelReaction) &&
                    event.context.player === context.player.opponent
            },
            gameAction: AbilityDsl.actions.discardAtRandom(context => ({
                target: context.player.opponent,
                amount: 1
            })),
            max: AbilityDsl.limit.perDuel(1)
        });

        this.reaction({
            title: 'Bow a character',
            when: {
                onMoveToConflict: (event, context) => context.source.controller !== context.player,
                onCardPlayed: (event, context) =>
                    event.card.isParticipating() && context.source.controller !== context.player
            },
            gameAction: AbilityDsl.actions.bow((context) => ({
                target: context.event.card
            }))
        });
    }
}
