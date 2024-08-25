import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Decks, Durations, Phases } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class ShadowOfTheLordsOfDeath extends DrawCard {
    static id = 'shadow-of-the-lords-of-death';

    setupCardAbilities() {
        this.reaction({
            title: 'Freeze a character under the shadow of fear',
            when: {
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            },
            cost: [AbilityDsl.costs.discardTopCardsFromDeck({ amount: 4, deck: Decks.DynastyDeck })],
            cannotTargetFirst: true,

            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.printedCost <= 4,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfRound,
                    effect: [
                        AbilityDsl.effects.cardCannot('declareAsAttacker'),
                        AbilityDsl.effects.cardCannot('declareAsDefender')
                    ]
                })
            },
            effect: 'prevent {0} from being declared as an attacker or defender this round'
        });
    }
}
