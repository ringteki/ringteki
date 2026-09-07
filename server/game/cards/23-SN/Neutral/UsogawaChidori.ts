import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Duration, Players } from '../../../Constants.js';

export default class UsogawaChidori extends DrawCard {
    static id = 'usogawa-chidori';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Blank a character',
            cost: AbilityDsl.costs.giveFateToOpponent(),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.blank(),
                    duration: Duration.UntilEndOfPhase
                })
            },
            effect: 'treat {1} as if it had no printed abilities until the end of the phase',
            effectArgs: (context) => [context.target ?? '']
        });
    }
}
