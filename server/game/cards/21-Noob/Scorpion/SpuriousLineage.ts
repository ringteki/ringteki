import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, Players, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class SpuriousLineage extends DrawCard {
    static id = 'spurious-lineage';

    public setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: (context) => context.game.isDuringConflict('political'),
            targets: {
                fromDiscard: {
                    activePromptTitle: 'Choose up to 2 characters from a discard pile',
                    mode: TargetModes.UpTo,
                    numCards: 2,
                    location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                    controller: Players.Opponent
                },
                toBow: {
                    dependsOn: 'fromDiscard',
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    cardCondition: (card: DrawCard, context) => {
                        return (
                            card.isParticipating() &&
                            card.costLessThan(
                                Math.max(...context.targets.fromDiscard.map((card: DrawCard) => card.getCost()))
                            )
                        );
                    },
                    gameAction: AbilityDsl.actions.bow()
                }
            },
            gameAction: AbilityDsl.actions.sequentialContext((context) => {
                const fromDiscard = context.targets.fromDiscard;
                const toBow = context.targets.toBow;
                return {
                    gameActions: [
                        AbilityDsl.actions.bow({ target: toBow }),
                        AbilityDsl.actions.removeFromGame({ target: fromDiscard })
                    ]
                };
            })
        });
    }
}
