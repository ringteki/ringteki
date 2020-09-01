const DrawCard = require('../../drawcard.js');
const { Players, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class DivineAncestry extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent losing honor this phase',
            when: {
                onPhaseStarted: event => event.phase !== 'setup'
            },
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                targetController: Players.Self,
                effect: [
                    AbilityDsl.effects.playerCannot({
                        cannot: 'loseHonor'
                    }),
                    AbilityDsl.effects.playerCannot({
                        cannot: 'takeHonor'
                    })
                ]
            }),
            effect: 'prevent {1} from losing honor this phase',
            effectArgs: context => [context.player]
        });
    }
}

DivineAncestry.id = 'divine-ancestry';

module.exports = DivineAncestry;
