const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Elements, Players, TargetModes } = require('../../Constants');

class WeightOfDuty extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow & dishonor a character',
            condition: context => context.game.isDuringConflict() && context.player.opponent,
            conflictProvinceCondition: province => province.isElement(Elements.Void),
            cannotTargetFirst: true,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating()
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
}

function weightOfDutyTargetCondition(card, context) {
    if(context.costs.sacrifice && !context.costs.sacrifice.isUnique()) {
        return !card.isUnique();
    }

    return true;
}

WeightOfDuty.id = 'weight-of-duty';

module.exports = WeightOfDuty;
