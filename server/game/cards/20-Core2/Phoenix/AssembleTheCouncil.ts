import { CardTypes, Locations, PlayTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AssembleTheCouncil extends DrawCard {
    static id = 'assemble-the-council';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.opponent && context.player.isMoreHonorable(),
            location: Locations.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDiscardPile, [this], this, PlayTypes.Other)
        });

        this.reaction({
            title: 'Ready characters',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            },
            target: {
                mode: TargetModes.UpTo,
                activePromptTitle: 'Choose characters',
                numCards: 2,
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: AbilityDsl.actions.sequentialContext((context) => ({
                    gameActions: [
                        AbilityDsl.actions.ready({ target: context.target }),
                        AbilityDsl.actions.moveCard({
                            target: context.source,
                            destination: Locations.ConflictDeck,
                            bottom: true
                        })
                    ]
                }))
            },
            max: AbilityDsl.limit.perConflictOpportunity(1)
        });
    }
}
