const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');

class SeekingEnlightenment extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Force opponent to lose fate equal to the number of attackers',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.loseFate(() => ({
                amount: this.game.currentConflict ? this.game.currentConflict.getNumberOfParticipantsFor('attacker') : 0
            }))
        });
    }
}

SeekingEnlightenment.id = 'seeking-enlightenment';

module.exports = SeekingEnlightenment;
