import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

const ATTACHMENT = 'attachment';
const RECEIVER = 'receiver';

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
            targets: {
                [ATTACHMENT]: {
                    cardType: CardTypes.Attachment,
                    cardCondition: (card) =>
                        card.parent && card.parent.type === CardTypes.Character && card.parent.isParticipating()
                },
                [RECEIVER]: {
                    dependsOn: ATTACHMENT,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isDefending(),
                    gameAction: AbilityDsl.actions.ifAble((context) => ({
                        ifAbleAction: AbilityDsl.actions.attach({
                            attachment: context.targets[ATTACHMENT],
                            target: context.targets[RECEIVER],
                            takeControl: true
                        }),
                        otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.targets[ATTACHMENT] })
                    }))
                }
            },
            effect: 'take an attachment from the attacker'
        });
    }
}
