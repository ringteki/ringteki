import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, Phases, Players, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class LegacyOfIron extends DrawCard {
    static id = 'legacy-of-iron';

    setupCardAbilities() {
        this.action({
            title: 'Return attachments from your conflict discard pile to your hand',
            phase: Phases.Fate,
            target: {
                activePromptTitle: 'Choose up to two attachments from your conflict discard pile',
                numCards: 2,
                mode: TargetModes.UpTo,
                cardType: CardTypes.Attachment,
                location: [Locations.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.hasSomeTrait('item', 'armor', 'weapon'),
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
            }
        });
    }
}
