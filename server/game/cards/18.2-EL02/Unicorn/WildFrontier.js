const ProvinceCard = require('../../../provincecard.js');
const { CardTypes, Players, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class WildFrontier extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Turn another unbroken province facedown',
            target: {
                cardType: CardTypes.Province,
                controller: Players.Any,
                location: Locations.Provinces,
                cardCondition: (card, context) => !card.isBroken && card !== context.source && card.location !== Locations.StrongholdProvince,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}

WildFrontier.id = 'wild-frontier';

module.exports = WildFrontier;
