const DrawCard = require('../../drawcard.js');
const { Durations, TargetModes, Phases } = require('../../Constants');

class EtherealDreamer extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +2/+2 while contesting the target ring',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: () => true
            },
            effect: 'give herself +2{1}/+2{2} while the {0} is contested',
            effectArgs: ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                condition: () => context.ring.isContested(),
                effect: ability.effects.modifyBothSkills(2)
            }))
        });
    }
}

EtherealDreamer.id = 'ethereal-dreamer';

module.exports = EtherealDreamer;
