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
                    activePromptTitle: 'Choose up to 3 characters from a discard pile',
                    mode: TargetModes.UpTo,
                    numCards: 3,
                    location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isUnique(),
                    gameAction: AbilityDsl.actions.putIntoConflict()
                },
                toBow: {
                    dependsOn: 'fromDiscard',
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => {
                        if (!card.isParticipating()) {
                            return false;
                        }
                        const cardFactions = Array.from(card.getFactions());
                        return context.targets.fromDiscard.some((fromDiscard: DrawCard) =>
                            cardFactions.some((cardFaction) => fromDiscard.isFaction(cardFaction))
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
                        AbilityDsl.actions.removeFromGame({ target: fromDiscard }),
                        AbilityDsl.actions.bow({ target: toBow })
                    ]
                };
            })
        });
    }
}
