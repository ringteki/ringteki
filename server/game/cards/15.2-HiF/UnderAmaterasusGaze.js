const AbilityDsl = require('../../abilitydsl');
const DrawCard = require('../../drawcard.js');
const { CardTypes, Players, PlayTypes } = require('../../Constants');

class UnderAmaterasusGaze extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { 'battlefield': 1 }
        });

        this.persistentEffect({
            condition: context => context.game.isDuringConflict() && context.source.parent.isConflictProvince() &&
                context.player.opponent && context.player.opponent.honor < context.player.honor + 5,
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.increaseCost({
                amount: 1,
                playingTypes: PlayTypes.PlayFromHand
            })
        });

        this.persistentEffect({
            condition: context => context.game.isDuringConflict() && context.source.parent.isConflictProvince() &&
                context.player.opponent && context.player.honor < context.player.opponent.honor + 5,
            targetController: Players.Self,
            effect: AbilityDsl.effects.increaseCost({
                amount: 1,
                playingTypes: PlayTypes.PlayFromHand
            })
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

UnderAmaterasusGaze.id = 'under-amaterasu-s-gaze';

module.exports = UnderAmaterasusGaze;

