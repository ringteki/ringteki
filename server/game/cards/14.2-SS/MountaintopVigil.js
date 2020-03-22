const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class MountaintopVigil extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'cancel all ring effects',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                effect: AbilityDsl.effects.delayedEffect({
                    when: {
                        onResolveRingElement: () => true
                    },
                    gameAction: AbilityDsl.actions.cancel(() => ({
                        replacementGameAction: AbilityDsl.actions.resolveRingEffect()
                    }))
                })
            }))
        });
    }
}

MountaintopVigil.id = 'mountaintop-vigil';

module.exports = MountaintopVigil;
