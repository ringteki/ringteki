const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class HallowedGround extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: context => context.game.rings.fire.isConsideredClaimed(context.player.opponent),
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'placeFateWhenPlayingCharacter',
                restrict: 'source'
            })
        });

        this.persistentEffect({
            targetController: Players.Opponent,
            condition: context => context.game.rings.air.isConsideredClaimed(context.player.opponent),
            effect: AbilityDsl.effects.playerDelayedEffect({
                when: {
                    afterConflict: (event, context) => event.conflict.loser === context.player.opponent && event.conflict.conflictUnopposed
                },
                gameAction: AbilityDsl.actions.loseHonor()
            })
        });
    }
}

HallowedGround.id = 'hallowed-ground';

module.exports = HallowedGround;
