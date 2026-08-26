import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class TheEmeraldCourt extends ProvinceCard {
    static id = 'the-emerald-court';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card: DrawCard, context) => card.type === CardType.Character && card.location === context?.source.location,
            effect: AbilityDsl.effects.gainExtraFateWhenPlayed()
        });
    }
}
