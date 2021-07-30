const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Elements, Locations } = require('../../../Constants.js');

const elementKey = 'henshin-seeker-void';

class HenshinSeeker extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: context =>
                context.source.isParticipating() &&
                this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player) ||
                (this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)) && this.game.currentConflict.ring.isContested()),
            effect: 'look at the top eight cards of their deck for a kiho or spell',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 8,
                cardCondition: (card, context) => (card.hasTrait('kiho') || card.hasTrait('spell')) && this.isCopyInDiscard(card, context),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }

    isCopyInDiscard = function(card, context) {
        return context.player.conflictDiscardPile.any(c => c.name === card.name);
    };

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring',
            element: Elements.Void
        });
        return symbols;
    }

}

HenshinSeeker.id = 'henshin-seeker';
module.exports = HenshinSeeker;
