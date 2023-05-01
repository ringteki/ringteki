import AbilityDsl = require('../../../abilitydsl');
import ProvinceCard = require('../../../provincecard');

export default class YatakabunePort extends ProvinceCard {
    static id = 'yatakabune-port';

    public setupCardAbilities() {
        this.interrupt({
            title: 'Claim the imperial favor',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.claimImperialFavor((context) => ({
                target: context.player
            }))
        });
    }
}
