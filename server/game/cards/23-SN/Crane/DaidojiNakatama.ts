import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiNakatama extends DrawCard {
    static id = 'daidoji-nakatama';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking() && context.game.currentConflict?.getNumberOfParticipantsFor('attacker') === 1,
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'moveToConflict',
                    restricts: 'opponentsCardEffects'
                })
            ]
        });

        this.action({
            title: 'Ready and dishonor a character',
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card !== context.source && card.costLessThan(4) && card.bowed,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.dishonor()
                ])
            },
            effect: 'ready and dishonor {0}'
        });
    }
}
