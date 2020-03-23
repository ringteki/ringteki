const DrawCard = require('../../drawcard.js');
const { CardTypes, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class MotoStables extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Give +2 military',
            limit: AbilityDsl.limit.perRound(2),
            when: {
                onMoveToConflict: (event, context) => event.card.type === CardTypes.Character &&
                    event.card.isParticipating() &&
                    event.card.controller === context.player
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                target: context.event.card,
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            }))
        });
    }
}

MotoStables.id = 'moto-stables';

module.exports = MotoStables;
