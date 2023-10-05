import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AscendantTastemaker extends DrawCard {
    static id = 'ascendant-tastemaker';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            condition: (context) => context.source.isHonored,
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
