const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
import { CardTypes, TargetModes } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');

class IsawaTsuke2 extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Lose honor to discard fate',
            effect: 'lose {1} honor to discard a fate from {2}',
            effectArgs: context => [context.costs.variableHonorCost, context.target],
            condition: context => context.game.isDuringConflict() && context.game.rings['fire'].isUnclaimed(),
            cost: AbilityDsl.costs.variableHonorCost(context => this.getNumberOfLegalTargets(context)),
            target: {
                mode: TargetModes.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context && context.costs && context.costs.variableHonorCost) {
                        return context.costs.variableHonorCost;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.removeFate(context => {
                    let targets = [];
                    targets = _.flatten(_.values(context.targets));
                    targets = targets.concat(_.flatten(_.values(context.selects)));

                    return ({ target: targets });
                })
            },
            cannotTargetFirst: true
        });
    }

    getNumberOfLegalTargets(context) {
        let cards = context.game.currentConflict.getParticipants(card => card.allowGameAction('removeFate'));
        let selectedCards = [];
        cards.forEach(card => {
            if(card.canBeTargeted(context, selectedCards)) {
                selectedCards.push(card);
            }
        });

        return selectedCards.length;
    }
}

IsawaTsuke2.id = 'isawa-tsuke-2';

module.exports = IsawaTsuke2;

