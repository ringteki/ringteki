const StrongholdCard = require('../../strongholdcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class HayakenNoShiro extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('bushi') && card.costLessThan(3),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}

HayakenNoShiro.id = 'hayaken-no-shiro';

module.exports = HayakenNoShiro;
