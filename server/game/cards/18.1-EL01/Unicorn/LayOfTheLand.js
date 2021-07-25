const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, TargetModes, Locations } = require('../../../Constants');

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
                activePromptTitle: 'Choose any number of provinces to reveal',
                controller: Players.Any,
                location: Locations.Provinces,
                cardCondition: card => card.facedown,
                mode: TargetModes.Unlimited,
                gameAction: AbilityDsl.actions.reveal(),
            },
            effect: 'reveal {1}',
            effectArgs: context => [context.target]
        });
    }
}

LayOfTheLand.id = 'lay-of-the-land';
module.exports = LayOfTheLand;
