import { CardTypes, ConflictTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ConfirmedSuspicions extends DrawCard {
    static id = 'confirmed-suspicions';

    setupCardAbilities() {
        this.action({
            title: 'Ready a shugenja',
            condition: (context) => context.game.isDuringConflict(ConflictTypes.Political),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.taint()
            },
            then: (context) => ({
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'earth',
                    promptTitleForConfirmingAffinity: 'Bow that character?',
                    gameAction: AbilityDsl.actions.bow({ target: context.target })
                })
            })
        });
    }
}
