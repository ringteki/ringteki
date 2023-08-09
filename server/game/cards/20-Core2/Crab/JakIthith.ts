import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class JakIthith extends DrawCard {
    static id = 'jak-ithith';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.immunity({ restricts: 'maho' }),
                AbilityDsl.effects.immunity({ restricts: 'shadowlands' })
            ]
        });

        this.reaction({
            title: 'Take control of an attachment',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isDefending()
            },
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card) =>
                    card.parent && card.parent.type === CardTypes.Character && card.parent.isParticipating(),
                gameAction: AbilityDsl.actions.ifAble((context) => ({
                    ifAbleAction: AbilityDsl.actions.selectCard({
                        target: context.target,
                        cardType: CardTypes.Character,
                        controller: Players.Self,
                        cardCondition: (card) => card.isDefending(),
                        gameAction: AbilityDsl.actions.attach({
                            attachment: context.target,
                            takeControl: true
                        }),
                        message: '{0} chooses to attach {1} to {2}',
                        messageArgs: (cards, player) => [player, context.target, cards]
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
                }))
            }
        });
    }
}
