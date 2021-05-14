const DrawCard = require('../../drawcard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

const elementKey = 'solemn-scholar-earth';

class SolemnScholar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: context => this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Earth
        });
        return symbols;
    }
}

SolemnScholar.id = 'solemn-scholar';

module.exports = SolemnScholar;
