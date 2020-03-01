const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
import { CardTypes, TargetModes } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');

class ImbuedWithShadows extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Lose honor to discard status tokens',
            effect: 'lose {1} honor to discard status tokens from {2}',
            effectArgs: context => [context.costs.variableHonorCost, context.target],
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
                gameAction: AbilityDsl.actions.discardStatusToken(context => {
                    let targets = [];
                    targets = _.flatten(_.values(context.targets));
                    targets = targets.concat(_.flatten(_.values(context.selects)));

                    return ({ target: targets.map(card => card.personalHonor) });
                })
            },
            cannotTargetFirst: true
        });
    }

    getNumberOfLegalTargets(context) {
        let cards = context.game.findAnyCardsInPlay(card => card.isHonored || card.isDishonored);
        let selectedCards = [];
        cards.forEach(card => {
            if(card.canBeTargeted(context, selectedCards)) {
                selectedCards.push(card);
            }
        });

        return selectedCards.length;
    }
}

ImbuedWithShadows.id = 'imbued-with-shadows';

module.exports = ImbuedWithShadows;

