const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbiltiyDsl = require('../../abilitydsl');

class DispatchToNowhere extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a character with no fate',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.fate === 0,
                gameAction: AbiltiyDsl.actions.discardFromPlay()
            }
        });
    }
}

DispatchToNowhere.id = 'dispatch-to-nowhere';

module.exports = DispatchToNowhere;
