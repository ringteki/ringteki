const DrawCard = require('../../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class Repurpose extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put a holding in a province',
            target: {
                cardType: CardTypes.Holding,
                controller: Players.Self,
                location: Locations.DynastyDiscardPile,
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose an unbroken province',
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: card => card.location !== Locations.StrongholdProvince && !card.isBroken,
                    message: '{0} places {1} in {2}',
                    messageArgs: card => [context.player, context.target, card.facedown ? card.location : card],
                    subActionProperties: card => ({ destination: card.location, target: context.player.getDynastyCardsInProvince(card.location) }),
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.moveCard({
                            target: context.target,
                            faceup: true
                        }),
                        AbilityDsl.actions.refillFaceup(context => ({
                            target: [context.source.controller],
                            location: context.game.getProvinceArray()
                        }))
                    ])
                }))
            },
            effect: 'put {0} into a province'
        });
    }
}

Repurpose.id = 'repurpose';

module.exports = Repurpose;
