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
                onCardPlayed: (event, context) =>
                    event.card.type === CardTypes.Attachment && event.player === context.player
                    // event.context.ability.getReducedCost(event.context) > 0
            },
            cost: AbilityDsl.costs.bowSelf(),
            effect: 'reduce the cost of their next attachment by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card === context.event.card)
            }))
        });
    }
}

IronMountainCastle.id = 'iron-mountain-castle';

module.exports = IronMountainCastle;
