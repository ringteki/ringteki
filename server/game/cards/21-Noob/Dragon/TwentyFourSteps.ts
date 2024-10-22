import AbilityDsl from '../../../abilitydsl';
import { CardTypes, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class TwentyFourSteps extends DrawCard {
    static id = 'twenty-four-steps';

    setupCardAbilities() {
        this.action({
            title: 'Move monks to the conflict',
            condition: (context) => context.game.isDuringConflict(),
            target: {
                activePromptTitle: 'Choose up to 2 monks',
                cardType: CardTypes.Character,
                mode: TargetModes.UpTo,
                numCards: 2,
                cardCondition: (card) => card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });

        this.action({
            title: 'Ready a Bushi and move it to the conflict',
            condition: (context) => context.game.isDuringConflict(),
            target: {
                activePromptTitle: 'Choose a Bushi',
                cardType: CardTypes.Character,
                cardCondition: (card) =>
                    card.hasTrait('bushi') && card.attachments.every((attach) => !attach.hasTrait('weapon')),
                gameAction: [AbilityDsl.actions.ready(), AbilityDsl.actions.moveToConflict()]
            }
        });
    }
}
