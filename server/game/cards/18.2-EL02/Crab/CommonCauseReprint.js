const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class CommonCauseReprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready character',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card, context) => this.hasValidTarget(card, context)
            }),
            cannotTargetFirst: true,
            target: {
                activePromptTitle: 'Choose a character to ready',
                cardType: CardTypes.Character,
                cardCondition: (card, context) => sacrificeTargetCondition(card, context),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }

    hasValidTarget(card, context) {
        return context.player.cardsInPlay.any(a => {
            return (a !== card && a.allowGameAction('ready', context) && a.printedCost <= card.printedCost + 2);
        }) ||
        (context.player.opponent && context.player.opponent.cardsInPlay.any(a => {
            return (a !== card && a.allowGameAction('ready', context) && a.printedCost <= card.printedCost + 2);
        }));
    }
}

function sacrificeTargetCondition(card, context) {
    if(context.costs.sacrifice) {
        return card.printedCost <= context.costs.sacrifice.printedCost + 2;
    }

    return true;
}

CommonCauseReprint.id = 'uncommon-cause';

module.exports = CommonCauseReprint;
