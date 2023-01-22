const DrawCard = require('../../../drawcard.js');
const { Players, TargetModes, Locations, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class PromisingHohei extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: target => target.type === CardTypes.Character && target.getGlory() >= 2,
                match: (card, source) => card === source
            })
        });

        this.reaction({
            title: 'return a follower to hand',
            when: {
                onCardAttached: (event, context) => event.card === context.source
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
