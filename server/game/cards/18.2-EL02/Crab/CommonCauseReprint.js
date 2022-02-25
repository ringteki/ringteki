const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class CommonCauseReprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready character',
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            target: {
                activePromptTitle: 'Choose a character to ready',
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}

CommonCauseReprint.id = 'uncommon-cause';

module.exports = CommonCauseReprint;
