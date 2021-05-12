const ProvinceCard = require('../../provincecard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class LordsAscendancy extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Place a fate on a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.placeFate(context => ({
                    origin: context.target.controller
                }))
            },
            effect: 'place a fate from {1}\'s fate pool on {0}',
            effectArgs: context => [context.target.controller]
        });
    }
}

LordsAscendancy.id = 'lord-s-ascendancy';

module.exports = LordsAscendancy;
