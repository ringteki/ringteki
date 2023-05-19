import { CardTypes, Locations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import StrongholdCard from '../../../strongholdcard';

export default class CrabBox extends StrongholdCard {
    static id = 'crab-box';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            match: (card) => card.type === CardTypes.Province,
            effect: AbilityDsl.effects.modifyProvinceStrength(1)
        });
    }
}
