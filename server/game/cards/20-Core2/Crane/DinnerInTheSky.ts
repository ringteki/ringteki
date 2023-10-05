import { CardTypes, Players } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';

export default class DinnerInTheSky extends ProvinceCard {
    static id = 'dinner-in-the-sky';

    public setupCardAbilities() {
        this.action({
            title: 'Ready a character and move it to the conflict',
            condition: (context) => context.game.currentConflict.defenders.length === 0,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.moveToConflict()
                ])
            },
            effect: 'ready {0} and move it into the conflict'
        });
    }
}
