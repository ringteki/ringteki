const AbilityDsl = require('../../../abilitydsl');
const DrawCard = require('../../../drawcard.js');

class SneakAttack extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'The attacker gets the first action opportunity',
            cost: AbilityDsl.costs.payHonor(1),
            when: { onConflictDeclared: () => true },
            effect: 'give {1} the first action in this conflict.',
            effectArgs: (context) => context.player,
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.gainActionPhasePriority()
            }))
        });
    }
}

SneakAttack.id = 'sneak-attack';

module.exports = SneakAttack;
