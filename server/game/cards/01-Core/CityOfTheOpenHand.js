const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl');

class CityOfTheOpenHand extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain an honor',
            cost: AbilityDsl.costs.bowSelf(),
            condition: context => context.player.opponent && context.player.honor < context.player.opponent.honor,
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }

    //Needed for testing some cards
    loadOriginalAction() {
        this.abilities.actions = [];
        this.action({
            title: 'Steal an honor',
            cost: AbilityDsl.costs.bowSelf(),
            condition: context => context.player.opponent && context.player.honor < context.player.opponent.honor,
            gameAction: AbilityDsl.actions.takeHonor()
        });
    }
}


CityOfTheOpenHand.id = 'city-of-the-open-hand';

module.exports = CityOfTheOpenHand;
