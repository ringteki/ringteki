const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Elements, Players, TargetModes } = require('../../Constants');

const elementKey = 'weight-of-duty-void';

class WeightOfDuty extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow & dishonor a character',
            condition: context => context.game.isDuringConflict() && context.player.opponent,
            conflictProvinceCondition: province => province.isElement(this.getCurrentElementSymbol(elementKey)),
            cannotTargetFirst: true,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && this.hasValidTarget(card, context)
            }),
            target: {
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                mode: TargetModes.Single,
                cardCondition: weightOfDutyTargetCondition,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.dishonor()
                ])
            }
        });
    }

    hasValidTarget(card, context) {
        if(card.isUnique()) { //uniques will always have a valid target based on the targeting check
            return true;
        }

        return context.player.opponent.cardsInPlay.any(a => {
            return !a.isUnique() && (a.allowGameAction('bow', context) || a.allowGameAction('dishonor', context));
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Elements.Void
        });
        return symbols;
    }
}

function weightOfDutyTargetCondition(card, context) {
    if(context.costs.sacrifice && !context.costs.sacrifice.isUnique()) {
        return !card.isUnique();
    }

    return true;
}

WeightOfDuty.id = 'weight-of-duty';

module.exports = WeightOfDuty;
