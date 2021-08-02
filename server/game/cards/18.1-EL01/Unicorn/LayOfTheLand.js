const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Locations } = require('../../../Constants');

class LayOfTheLand extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: context => !context.game.isDuringConflict(),
            title: 'Reveal/Flip Facedown two provinces',
            target: {
                activePromptTitle: 'Choose a faceup province',
                cardType: CardTypes.Province,
                controller: Players.Any,
                location: Locations.Provinces,
                cardCondition: card => !card.isBroken && !card.isFacedown(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.turnFacedown(),
                    AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Choose a province to reveal',
                        controller: Players.Any,
                        cardType: CardTypes.Province,
                        location: Locations.Provinces,
                        cardCondition: (card, context) => card !== context.target && card.controller === context.target.controller,
                        message: '{0} uses {2} to reveal {1}',
                        messageArgs: card => [context.player, card, context.source],
                        gameAction: AbilityDsl.actions.reveal()
                    }))
                ])
            }
        });
    }
}

LayOfTheLand.id = 'lay-of-the-land';
module.exports = LayOfTheLand;
