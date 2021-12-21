const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations, Players } = require('../../../Constants.js');

class MasterAtArms extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Return a weapon attachment in your conflict discard pile to your hand',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Choose a weapon attachment from your conflict discard pile',
                cardCondition: card => card.hasTrait('weapon'),
                location: [Locations.ConflictDiscardPile],
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
            }
        });
    }
}

MasterAtArms.id = 'master-at-arms';

module.exports = MasterAtArms;


