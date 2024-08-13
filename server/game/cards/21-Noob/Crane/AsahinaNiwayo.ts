import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class AsahinaNiwayo extends DrawCard {
    static id = 'asahina-niwayo';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            targetLocation: Locations.PlayArea,
            match: (card) => card.getType() === CardTypes.Character,
            effect: AbilityDsl.effects.cardCostToAttackMilitary(1)
        });
    }
}
