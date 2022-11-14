const DrawCard = require('../../../drawcard.js');
const { Players, TargetModes, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class PromisingHohei extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'return a follower to hand',
            when: {
                onCardAttached: (event, context) => event.card === context.source,
            },
            target: {
                mode: TargetModes.Single,
                controller: Players.Self,
                cardCondition: (card, context) => card.hasTrait('follower') && card !== context.source,
                gameAction: AbilityDsl.actions.returnToHand()
            }
        });
    }
}

PromisingHohei.id = 'promising-hohei';

module.exports = PromisingHohei;
