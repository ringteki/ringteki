const AbilityDsl = require('../../../abilitydsl');
const ProvinceCard = require('../../../provincecard.js');

class YatakabunePort extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Claim the imperial favor',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.claimImperialFavor(context => ({
                target: context.player
            }))
        });
    }
}

YatakabunePort.id = 'yatakabune-port';

module.exports = YatakabunePort;
