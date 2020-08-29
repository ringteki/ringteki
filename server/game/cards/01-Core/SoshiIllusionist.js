const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class SoshiIllusionist extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard status from character',
            cost: AbilityDsl.costs.payFate(1),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.discardStatusToken(context => ({ target: context.target.personalHonor }))
            }
        });
    }
}

SoshiIllusionist.id = 'soshi-illusionist';

module.exports = SoshiIllusionist;
