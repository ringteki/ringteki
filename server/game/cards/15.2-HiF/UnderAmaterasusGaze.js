const AbilityDsl = require('../../abilitydsl');
const BattlefieldAttachment = require('../BattlefieldAttachment');
const { Players, PlayTypes } = require('../../Constants');

class UnderAmaterasusGaze extends BattlefieldAttachment {
    setupCardAbilities() {
        super.setupCardAbilities();

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
}

UnderAmaterasusGaze.id = 'under-amaterasu-s-gaze';

module.exports = UnderAmaterasusGaze;

