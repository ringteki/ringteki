const DrawCard = require('../../drawcard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class SolemnScholar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: context => this.game.rings[this.getCurrentElementSymbol('solemn-scholar-earth')].isConsideredClaimed(context.player),
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
            key: 'solemn-scholar-earth',
            prettyName: 'Claimed Ring',
            element: Elements.Earth
        });
        return symbols;
    }
}

SolemnScholar.id = 'solemn-scholar';

module.exports = SolemnScholar;
