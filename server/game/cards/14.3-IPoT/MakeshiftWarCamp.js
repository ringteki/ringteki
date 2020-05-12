import { CardTypes, Players } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');
const DrawCard = require('../../drawcard.js');

class MakeshiftWarCamp extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { 'battlefield': 1 }
        });

        this.persistentEffect({
            condition: context => context.game.isDuringConflict() && context.source.parent.isConflictProvince(),
            targetController: Players.Self,
            match: card => card.isParticipating() && card.type === CardTypes.Character,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }

    canPlayOn(source) {
        return source && source.getType() === 'province' && !source.isBroken && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent) {
        if(parent.type === CardTypes.Province && parent.isBroken) {
            return false;
        }

        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}

MakeshiftWarCamp.id = 'makeshift-war-camp';

module.exports = MakeshiftWarCamp;

