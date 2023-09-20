import { CardTypes, Decks, Durations, Locations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SecondWind extends DrawCard {
    static id = 'second-wind';

    public setupCardAbilities() {
        this.action({
            title: 'put a character from your discard pile into play',
            cannotTargetFirst: true,
            cost: [AbilityDsl.costs.discardTopCardsFromDeck({ amount: 4, deck: Decks.DynastyDeck })],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.handler({
                    handler: () => true
                }),
                AbilityDsl.actions.selectCard((context) => ({
                    location: Locations.DynastyDiscardPile,
                    cardType: CardTypes.Character,
                    cardCondition: (card) => !card.isUnique,
                    cntroller: Players.Self,
                    targets: true,
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.putIntoPlay(),
                        AbilityDsl.actions.cardLastingEffect((context) => ({
                            duration: Durations.UntilEndOfConflict,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onPhaseEnded: () => true
                                },
                                message: "{0} returns to the bottom of the deck due to {1}'s effect",
                                messageArgs: (effectContext, effectTargets) => [effectTargets, context.source],
                                gameAction: AbilityDsl.actions.returnToDeck({ bottom: true })
                            })
                        }))
                    ]),
                    message:
                        "{0} puts {1} into play. {1} will be put on the bottom of the deck if it's still in play by the end of the conflict",
                    messageArgs: (card) => [context.player, card, context.source]
                }))
            ]),
            effect: 'put a dynasty character into play'
        });
    }
}
