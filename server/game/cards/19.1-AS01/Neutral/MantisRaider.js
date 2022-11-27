const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class MantisRaider extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Steal a fate',
            when: {
                onDefendersDeclared: (event, context) =>
                    context.source.isAttacking() &&
                    event.conflict.defenders.length === 0
            },
            effect: 'take a fate from {1} and place it on {0}.',
            effectArgs: (context) => context.player.opponent,
            gameAction: AbilityDsl.actions.placeFate((context) => ({
                origin: context.player.opponent
            }))
        });

        this.action({
            title: 'Give this character +2/+2',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.removeFateFromSelf(),
            effect: 'give himself +2{1}/+2{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyBothSkills(2)
            }),
            limit: AbilityDsl.limit.perConflict(2)
        });
    }
}

MantisRaider.id = 'mantis-raider';

module.exports = MantisRaider;
