const ProvinceCard = require('../../../provincecard.js');
const { DuelTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class SadaneAcademy extends ProvinceCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel a duel',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onDuelInitiated: (event, context) => {
                    return context.source.isConflictProvince() && event.challenger && event.challenger.controller === context.player &&
                        event.duelType === DuelTypes.Political;
                }
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => {
                return ({
                    target: context.event.challenger,
                    effect: AbilityDsl.effects.winDuel(context.event.duel),
                    duration: Durations.UntilEndOfDuel
                });
            }),
            effect: 'win the duel originating from {1}',
            effectArgs: context => context.event.context.source
        });
    }
}

SadaneAcademy.id = 'sadane-academy';

module.exports = SadaneAcademy;
