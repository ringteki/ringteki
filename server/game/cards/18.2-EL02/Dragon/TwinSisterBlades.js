const DrawCard = require('../../../drawcard.js');
const { Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class TwinSisterBlades extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.currentDuel && this.game.currentDuel.isInvolved(context.source.parent),
            targetController: Players.Opponent,
            effect: [
                AbilityDsl.effects.cannotBidInDuels('4'),
                AbilityDsl.effects.cannotBidInDuels('5')
            ]
        });

        this.persistentEffect({
            condition: context => context.game.currentDuel && this.game.currentDuel.isInvolved(context.source.parent),
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyHonorTransferGiven(-1)
        });
    }
}

TwinSisterBlades.id = 'twin-sister-blades';

module.exports = TwinSisterBlades ;
