const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class SurveillanceDetail extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard a card',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source.parent)
            },
            gameAction: AbilityDsl.actions.chosenDiscard(context => ({
                target: context.player.opponent
            })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}

SurveillanceDetail.id = 'surveillance-detail';

module.exports = SurveillanceDetail;
