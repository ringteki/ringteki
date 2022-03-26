const DrawCard = require('../../../drawcard.js');
const { CardTypes, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class SulfurMine extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            cost: AbilityDsl.costs.payFate(1),
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardTypes.Character && event.card.location === Locations.PlayArea
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel({
                replacementGameAction: AbilityDsl.actions.sacrifice(context => ({ target: context.source }))
            })
        });

        this.reaction({
            title: 'Discard this card',
            anyPlayer: true,
            when: {
                // Not as printed, but doesn't make sense to prompt you to discard your own mine (remove context.player !== context.source.controller if you want to allow that)
                onBreakProvince: (event, context) => event.card.owner !== context.player && context.player !== context.source.controller && context.source.controller.getProvinceCardInProvince(context.source.location).isBroken
            },
            gameAction: AbilityDsl.actions.moveCard(context => ({
                destination: Locations.DynastyDiscardPile,
                target: context.source
            })),
            effect: 'discard {1}',
            effectArgs: context => [context.source]
        });
    }
}

SulfurMine.id = 'sulfur-mine';

module.exports = SulfurMine;
