const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { TargetModes } = require('../../../Constants.js');

class ConduitOfTheElements extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch the contested ring',
            condition: context => context.source.isParticipating(),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a claimed ring',
                ringCondition: (ring, context) => ring.claimedBy === context.player.name,
                gameAction: AbilityDsl.actions.switchConflictElement()
            },
            effect: 'switch the contested ring with the {0}'
        });
    }
}

ConduitOfTheElements.id = 'conduit-of-the-elements';
module.exports = ConduitOfTheElements;
