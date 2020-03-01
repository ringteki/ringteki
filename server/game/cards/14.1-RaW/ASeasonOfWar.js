const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class ASeasonOfWar extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor a character',
            target: {
                cardType: CardTypes.Character,
                gameAction: ability.actions.dishonor()
            }
        });
    }
}

ASeasonOfWar.id = 'a-season-of-war';

module.exports = ASeasonOfWar;
