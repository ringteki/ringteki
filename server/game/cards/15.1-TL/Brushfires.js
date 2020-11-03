const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class Brushfires extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove 2 fate from an attacking character',
            when:{
                onCardRevealed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.removeFate({
                    amount: 2
                })
            }
        });
    }
}

Brushfires.id = 'brushfires';

module.exports = Brushfires;
