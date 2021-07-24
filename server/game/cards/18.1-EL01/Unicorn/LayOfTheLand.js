const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, TargetModes } = require('../../../Constants');

class LayOfTheLand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Reveal Provinces',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                                                   context.player.isAttackingPlayer()
            },
            target: {
                cardType: CardTypes.Province,
                controller: Players.Any,
                cardCondition: card => card.facedown,
                mode: TargetModes.Unlimited,
                gameAction: AbilityDsl.actions.reveal(),
            },
        });
    }
}

LayOfTheLand.id = 'lay-of-the-land';
module.exports = LayOfTheLand;
