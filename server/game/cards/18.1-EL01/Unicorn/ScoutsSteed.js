const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class ScoutsSteed extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('cavalry')
        });

        this.reaction({
            title: 'Get first action',
            when: {
                onConflictDeclared: (event, context) => context.source.parent && event.attackers.includes(context.source.parent)
            },
            effect: 'get the first action in this conflict',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.gainActionPhasePriority()
            })),
            limit: AbilityDsl.limit.perRound(2)
        });
    }
}

ScoutsSteed.id = 'scout-s-steed';
module.exports = ScoutsSteed;
