import { AbilityTypes, Players } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class Shori extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            unique: true,
            faction: 'lion'
        });

        this.whileAttached({
            match: card => card.hasTrait('champion'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Persistent ,{
                targetController: Players.Self,
                effect: AbilityDsl.effects.additionalConflict('military')
            })
        });
    }
}

Shori.id = 'shori';

module.exports = Shori;
