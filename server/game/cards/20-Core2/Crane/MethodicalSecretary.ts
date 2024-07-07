import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class MethodicalSecretary extends DrawCard {
    static id = 'methodical-secretary';

    setupCardAbilities() {
        this.interrupt({
            title: 'Ready for Glory Count',
            when: {
                onGloryCount: () => true
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}
