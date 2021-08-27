const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players } = require('../../../Constants.js');

class OneWithTheSea extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character you control to the conflict',
            // max: AbilityDsl.limit.perRound(1),
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });

        this.action({
            title: 'Move any character to the conflict',
            cost: AbilityDsl.costs.payFate(1),
            max: AbilityDsl.limit.perRound(1),
            condition: context => context.game.isDuringConflict() && context.game.rings['water'].isConsideredClaimed(context.player),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}

OneWithTheSea.id = 'one-with-the-sea';
module.exports = OneWithTheSea;
