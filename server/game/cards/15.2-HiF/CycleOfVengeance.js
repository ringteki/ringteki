const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class CycleOfVengeance extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Place a fate on a character then honor it',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.placeFate({amount: 1}),
                    AbilityDsl.actions.honor()
                ])
            },
            effect: 'honor and place a fate on {0}'
        });
    }
}

CycleOfVengeance.id = 'cycle-of-vengeance';

module.exports = CycleOfVengeance;
