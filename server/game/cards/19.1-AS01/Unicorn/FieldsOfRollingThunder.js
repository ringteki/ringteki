const ProvinceCard = require('../../../provincecard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes } = require('../../../Constants');

class FieldsOfRollingThunder extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            canTriggerOutsideConflict: true,
            condition: (context) => {
                const hasPassedAConflict =
                    context.game
                        .getConflicts(context.player)
                        .filter((conflict) => conflict.passed).length > 0;
                return hasPassedAConflict;
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

FieldsOfRollingThunder.id = 'fields-of-rolling-thunder';

module.exports = FieldsOfRollingThunder;
