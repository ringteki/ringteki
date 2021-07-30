const DrawCard = require('../../../drawcard.js');
const { CardTypes, PlayTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class NobleVanguard extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place a fate on a character',
            when: {
                onCardPlayed: (event, context) => event.card === context.source && event.playType === PlayTypes.PlayFromProvince
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.hasTrait('bushi') && card !== context.source,
                gameAction: AbilityDsl.actions.placeFate()
            }
        });
    }
}

NobleVanguard.id = 'noble-vanguard';

module.exports = NobleVanguard;
