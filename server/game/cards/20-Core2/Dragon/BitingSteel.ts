import { CardTypes, DuelTypes, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import TriggeredAbilityContext from '../../../TriggeredAbilityContext';

export default class BitingSteel extends DrawCard {
    static id = 'biting-steel';

    public setupCardAbilities() {
        this.duelFocus({
            title: 'Add a Weapon to your duel stats',
            duelCondition: (duel, context) =>
                (duel.duelType === DuelTypes.Military || duel.duelType === DuelTypes.Political) &&
                duel.isInvolved(context.source.parent),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card: DrawCard, context) =>
                    card.parent &&
                    context.event.duel.isInvolved(card.parent) &&
                    this.#getAttachmentSkill(card, context) !== 0,
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.target.parent,
                    effect: AbilityDsl.effects.modifyDuelSkill(
                        this.#getAttachmentSkill(context.target, context),
                        context.event.duel
                    ),
                    duration: Durations.UntilEndOfDuel
                }))
            },
            effect: 'add the skill bonus of {0} ({1}) to their duel total',
            effectArgs: (context) => [this.#getAttachmentSkill(context.target, context)]
        });

        this.action({
            title: 'Get a skill bonus',
            condition: (context) => (context.source.parent as DrawCard | undefined)?.isParticipating('military'),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            })),
            effect: 'give +2 military to {1}',
            effectArgs: (context) => [context.source.parent],
            then: (context) => ({
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'fire',
                    promptTitleForConfirmingAffinity: 'Send a character home?',
                    gameAction: AbilityDsl.actions.selectCard({
                        cardType: CardTypes.Character,
                        cardCondition: (card: DrawCard) => card.militarySkill < context.source.parent.militarySkill,
                        gameAction: AbilityDsl.actions.sendHome()
                    }),
                    effect: 'send a character home'
                })
            })
        });
    }

    #getAttachmentSkill(card: DrawCard, context: TriggeredAbilityContext) {
        let amount = 0;
        if (context.game.currentDuel.duelType === DuelTypes.Military) {
            amount = parseInt(card.cardData.military_bonus);
        } else if (context.game.currentDuel.duelType === DuelTypes.Political) {
            amount = parseInt(card.cardData.political_bonus);
        }

        return isNaN(amount) ? 0 : amount;
    }
}
