const StrongholdCard = require('../../strongholdcard.js');
const { CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class IronMountainCastle extends StrongholdCard {
    setupCardAbilities() {
        // this.persistentEffect({
        //     match: card => card.isFaction('dragon'),
        //     targetController: Players.Self,
        //     effect: AbilityDsl.effects.modifyMilitarySkill(1)
        // });

        this.interrupt({
            title: 'Reduce cost of next attachment',
            when: {
                onAbilityResolverInitiated: (event, context) =>
                    event.context.source.type === CardTypes.Attachment && event.context.player === context.player &&
                    event.context.target && event.context.target.controller === context.player &&
                    event.context.ability.getReducedCost(event.context) > 0
            },
            cost: AbilityDsl.costs.bowSelf(),
            effect: 'reduce the cost of their next attachment by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card === context.event.context.source)
            }))
        });
    }
}

IronMountainCastle.id = 'iron-mountain-castle';

module.exports = IronMountainCastle;
