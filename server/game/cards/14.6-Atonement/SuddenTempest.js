const DrawCard = require('../../drawcard.js');
const { TargetModes, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class SuddenTempest extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove a ring from play',
            target: {
                mode: TargetModes.Ring,
                ringCondition: () => true,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.removeRingFromPlay(),
                    AbilityDsl.actions.ringLastingEffect(context => ({
                        duration: Durations.UntilEndOfRound,
                        target: context.ring.getElements().map(element => this.game.rings[element]),
                        effect: AbilityDsl.effects.delayedEffect(context => ({
                            when: {
                                OnRoundEnded: () => true
                            },
                            target: context.ring.getElements().map(element => this.game.rings[element]),
                            gameAction: AbilityDsl.actions.returnRingToPlay()
                        }))
                    }))
                ])
            },
            effect: 'Remove the {0} from the game and return it at the end of the round'
        });
    }
}

SuddenTempest.id = 'sudden-tempest';

module.exports = SuddenTempest;
