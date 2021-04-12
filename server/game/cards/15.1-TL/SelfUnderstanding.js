const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
import { AbilityTypes } from '../../Constants.js';

class SelfUnderstanding extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsEvents',
                source: this
            })
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Resolve all claimed ring effects',
                when: {
                    afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                condition: context => context.player.getClaimedRings().length > 0,
                gameAction: AbilityDsl.actions.resolveRingEffect(context => ({
                    player: context.player,
                    target: context.player.getClaimedRings()
                })),
                effect: 'resolve all their claimed ring effects'
            })
        });
    }
}

SelfUnderstanding.id = 'self-understanding';

module.exports = SelfUnderstanding;
