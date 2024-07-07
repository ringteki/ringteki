import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type BaseCard from '../../../basecard';

export default class SupportingCast extends DrawCard {
    static id = 'supporting-cast';

    setupCardAbilities() {
        this.reaction({
            when: {
                onInitiateAbilityEffects: (event, context) => {
                    return (
                        context.game.isDuringConflict('military') &&
                        event.cardTargets.some((card: BaseCard) => card.controller === context.player)
                    );
                }
            },
            title: 'Give +3 military to a character',
            target: {
                activePromptTitle: 'Choose a character to give +3 military skill',
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card: DrawCard, context: any) =>
                    card.isParticipating() &&
                    !context.event.cardTargets.some((eventCard: BaseCard) => eventCard === card),
                gameAction: [
                    AbilityDsl.actions.selectCard((context) => ({
                        activePromptTitle: 'Choose a character to bow',
                        hidePromptIfSingleCard: true,
                        cardCondition: (card, context: any) =>
                            context.event.cardTargets.some((eventCard: BaseCard) => eventCard === card),
                        subActionProperties: (card) => {
                            context.target = card;
                            return { target: card };
                        },
                        gameAction: AbilityDsl.actions.bow()
                    })),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfConflict,
                        effect: AbilityDsl.effects.modifyMilitarySkill(3)
                    })
                ]
            },
            effect: 'give +3 military skill to {1} - {2} was just a distraction!',
            effectArgs: (context) => [context.target, context.event.cardTargets],
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
