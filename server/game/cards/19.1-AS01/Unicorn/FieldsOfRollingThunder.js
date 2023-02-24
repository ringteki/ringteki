const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes } = require('../../../Constants');

class FieldsOfRollingThunder extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Discard this holding',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player && event.conflict.conflictUnopposed
            },
            gameAction: AbilityDsl.actions.discardFromPlay()
        });

        this.action({
            title: 'Honor a character',
            condition: (context) =>
                Object.values(this.game.rings).some((ring) => ring.isConsideredClaimed(context.player)),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isFaction('unicorn'),
                gameAction: AbilityDsl.actions.honor()
            },
            max: AbilityDsl.limit.perRound(2)
        });
    }
}

FieldsOfRollingThunder.id = 'fields-of-rolling-thunder';

module.exports = FieldsOfRollingThunder;
