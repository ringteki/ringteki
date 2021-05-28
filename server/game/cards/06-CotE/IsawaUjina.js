const DrawCard = require('../../drawcard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

const elementKey = 'isawa-ujina-void';

class IsawaUjina extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Remove a character from the game',
            when: {
                onClaimRing: (event) => (event.conflict && event.conflict.ring.hasElement(this.getCurrentElementSymbol(elementKey))) || event.ring.hasElement(this.getCurrentElementSymbol(elementKey))
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.getFate() === 0,
                gameAction: AbilityDsl.actions.removeFromGame()
            },
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Void
        });
        return symbols;
    }
}

IsawaUjina.id = 'isawa-ujina';

module.exports = IsawaUjina;
