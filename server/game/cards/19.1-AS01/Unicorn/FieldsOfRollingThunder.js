const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes } = require('../../../Constants');

class FieldsOfRollingThunder extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.controller.isDefendingPlayer(),
            effect: AbilityDsl.effects.modifyUnopposedHonorLoss(1)
        });

        this.action({
            title: 'Honor a character',
            condition: context => Object.values(this.game.rings).some(ring => ring.isConsideredClaimed(context.player)),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('unicorn'),
                gameAction: AbilityDsl.actions.honor()
            },
            max: AbilityDsl.limit.perRound(2)
        });
    }
}

FieldsOfRollingThunder.id = 'fields-of-rolling-thunder';

module.exports = FieldsOfRollingThunder;
