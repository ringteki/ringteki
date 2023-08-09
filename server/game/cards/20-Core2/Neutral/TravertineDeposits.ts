import { CardTypes, Locations, Players } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import ProvinceCard = require('../../../provincecard');

export default class TravertineDeposits extends ProvinceCard {
    static id = 'travertine-deposits';

    public setupCardAbilities() {
        this.interrupt({
            title: 'Blank and reveal a province',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.dishonorProvince(),
                    AbilityDsl.actions.reveal({ chatMessage: true })
                ])
            }
        });
    }
}