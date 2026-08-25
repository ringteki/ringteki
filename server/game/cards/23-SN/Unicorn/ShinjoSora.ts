import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import ShinjoSoraBeast from '../../ShinjoSoraBeast.js';

export default class ShinjoSora extends DrawCard {
    static id = 'shinjo-sora';

    setupCardAbilities() {
        this.conflictAction({
            title: 'Create beasts from facedown dynasty cards',
            effect: 'release the hounds!',
            gameAction: AbilityDsl.actions.createToken((context) => ({
                target: context.game
                    .getProvinceArray()
                    .flatMap((location: Location) =>
                        context.player.getDynastyCardsInProvince(location).filter((card: DrawCard) => card.isFacedown())
                    ),
                token: ShinjoSoraBeast,
                canEnterConflict: () => true,
                leavingPlayMessage: "{0} grows tired and decides to have a nap"
            }))
        });
    }
}
