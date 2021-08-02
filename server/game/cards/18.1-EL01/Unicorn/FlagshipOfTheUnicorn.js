const { CardTypes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');
const ProvinceCard = require('../../../provincecard.js');

class FlagshipofTheUnicorn extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}

FlagshipofTheUnicorn.id = 'flagship-of-the-unicorn';

module.exports = FlagshipofTheUnicorn;
