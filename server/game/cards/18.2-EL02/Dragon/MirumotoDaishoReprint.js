const DrawCard = require('../../../drawcard.js');
const { Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class MirumotoDaishoReprint extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.game.currentDuel && this.game.currentDuel.isInvolved(context.source.parent),
            targetController: Players.Opponent,
            effect: [
                ability.effects.cannotBidInDuels('4'),
                ability.effects.cannotBidInDuels('5')
            ]
        });

        this.wouldInterrupt({
            title: 'Reduce honor transfer',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onTransferHonor: (event, context) => event.player === context.player && event.amount > 0 &&
                    context.game.currentDuel && context.game.currentDuel.isInvolvedInAnyDuel(this.parent)
            },
            gameAction: AbilityDsl.actions.cancel(context => ({
                replacementGameAction: AbilityDsl.actions.takeHonor({
                    target: context.player,
                    amount: context.event.amount - 1
                })
            })),
            effect: 'give 1 fewer honor'
        });
    }
}

MirumotoDaishoReprint.id = 'mirumoto-katana';

module.exports = MirumotoDaishoReprint ;
