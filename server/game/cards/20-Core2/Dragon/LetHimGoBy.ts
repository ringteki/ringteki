import { CardTypes, Players, Durations, DuelTypes } from '../../../Constants';
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
        this.duelFocus({
            title: 'Help a character with a duel',
            duelCondition: (duel) => duel.duelType === DuelTypes.Military || duel.duelType === DuelTypes.Political,
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) =>
                    card.parent &&
                    context.event.duel.isInvolved(card.parent) &&
                    this.getAttachmentSkill(card, context) !== 0,
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.target.parent,
                    effect: AbilityDsl.effects.modifyDuelSkill(
                        this.getAttachmentSkill(context.target, context),
                        context.event.duel
                    ),
                    duration: Durations.UntilEndOfDuel
                }))
            },
            effect: 'add the skill bonus of {0} ({1}) to their duel total',
            effectArgs: (context) => [this.getAttachmentSkill(context.target, context)]
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
