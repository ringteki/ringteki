const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, TargetModes } = require('../../Constants');

class ChancellorsAide extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Player discards a card',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            cost: AbilityDsl.costs.optionalHonorTransferFromOpponentCost(),
            targets: {
                myPlayer: {
                    mode: TargetModes.Select,
                    targets: true,
                    choices: {
                        [this.owner.name]: AbilityDsl.actions.chosenDiscard(context => ({ target: context.player })),
                        [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.chosenDiscard(context => ({ target: context.player.opponent }))
                    }
                },
                oppPlayer: {
                    mode: TargetModes.Select,
                    targets: true,
                    player: Players.Opponent,
                    condition: context => context.costs.optionalHonorTransferFromOpponentCostPaid,
                    choices: {
                        [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.chosenDiscard(choiceContext => ({ target: choiceContext.player.opponent })),
                        [this.owner.name]: AbilityDsl.actions.chosenDiscard(choiceContext => ({ target: choiceContext.player }))
                    }
                }
            },
            cannotTargetFirst: true
        });
    }
}

ChancellorsAide.id = 'chancellor-s-aide';

module.exports = ChancellorsAide;
