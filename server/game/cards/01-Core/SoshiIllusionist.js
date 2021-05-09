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
                gameAction: AbilityDsl.actions.selectToken(context => ({
                    card: context.target,
                    message: '{0} discards {1}',
                    messageArgs: (token, player) => [player, token],
                    gameAction: AbilityDsl.actions.discardStatusToken()
                }))
            },
            effect: 'discard a status token from {0}'
        });
    }
}

SoshiIllusionist.id = 'soshi-illusionist';

module.exports = SoshiIllusionist;
