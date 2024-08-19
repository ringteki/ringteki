import AbilityDsl from '../../../abilitydsl';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class IkomaBard extends DrawCard {
    static id = 'ikoma-bard';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor or dishonor a character',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            target: {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.chooseAction({
                    options: {
                        'Honor this character': {
                            action: AbilityDsl.actions.honor(),
                            message: '{0} chooses to honor {1}'
                        },
                        'Dishonor this character': {
                            action: AbilityDsl.actions.dishonor(),
                            message: '{0} chooses to dishonor {1}'
                        }
                    }
                })
            }
        });
    }
}