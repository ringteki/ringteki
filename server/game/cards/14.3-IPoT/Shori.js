const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class Shori extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'lion'
        });

        this.whileAttached({
            match: card => card.hasTrait('champion'),
            effect: AbilityDsl.effects.characterProvidesAdditionalConflict('military')
        });
    }
}

Shori.id = 'shori';

module.exports = Shori;
