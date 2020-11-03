const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes, TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class IsawaTadaka2 extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove discarded characters to discard a card',
            condition: context => context.game.isDuringConflict() && context.player.opponent,
            cost: AbilityDsl.costs.removeFromGame({
                cardType: CardTypes.Character,
                location: Locations.DynastyDiscardPile,
                mode: TargetModes.Unlimited
            }),
            gameAction: AbilityDsl.actions.multipleContext(context => {
                let cards = context.player.opponent && context.costs.removeFromGame ? context.player.opponent.hand.shuffle().slice(0, context.costs.removeFromGame.length) : [context.source];
                return ({
                    gameActions: [
                        AbilityDsl.actions.lookAt(() => ({
                            target: cards.sort(card => card.name)
                        })),
                        AbilityDsl.actions.cardMenu(context => ({
                            cards: cards.sort(card => card.name),
                            targets: true,
                            message: '{0} chooses {1} to be discarded',
                            messageArgs: card => [context.player, card],
                            gameAction: AbilityDsl.actions.discardCard()
                        }))
                    ]
                });
            }),
            effect: 'look at {1} random card{3} in {2}\'s hand',
            effectArgs: context => [context.costs.removeFromGame.length, context.player.opponent, context.costs.removeFromGame.length === 1 ? '' : 's']
        });
    }
}

IsawaTadaka2.id = 'isawa-tadaka-2';

module.exports = IsawaTadaka2;
