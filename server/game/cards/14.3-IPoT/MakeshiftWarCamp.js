import { CardTypes, Players } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');
const BattlefieldAttachment = require('../BattlefieldAttachment');

class MakeshiftWarCamp extends BattlefieldAttachment {
    setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            condition: context => context.game.isDuringConflict() && context.source.parent.isConflictProvince(),
            targetController: Players.Self,
            match: card => card.isParticipating() && card.type === CardTypes.Character,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }
}

MakeshiftWarCamp.id = 'makeshift-war-camp';

module.exports = MakeshiftWarCamp;

