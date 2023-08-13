import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class RunToTheHills extends DrawCard {
    static id = 'run-to-the-hills';

    setupCardAbilities() {
        this.action({
            title: 'Move a character home',
            condition: () => this.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.payHonor(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}
