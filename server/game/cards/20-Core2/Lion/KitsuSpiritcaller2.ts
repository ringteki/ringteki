import { Durations, Locations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KitsuSpiritcaller2 extends DrawCard {
    static id = 'kitsu-spiritcaller-2';

    setupCardAbilities() {
        this.action({
            title: 'Resurrect a character',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.isFaction('lion'),
                gameAction: AbilityDsl.actions.putIntoConflict()
            },
            effect: 'call {0} back from the dead until the end of the conflict',
            then: (context) => ({
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    target: context.target,
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: "{0} returns to the bottom of the deck due to {1}'s effect",
                        messageArgs: [context.target, context.source],
                        gameAction: AbilityDsl.actions.returnToDeck({ bottom: true })
                    })
                })
            })
        });
    }
}
