const AbilityDsl = require('../../../abilitydsl');
const DrawCard = require('../../../drawcard.js');
const { Phases } = require('../../../Constants');

class PlantedFields extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Gain 1 fate, gain 1 honor and draw 1 card',
            when : {
                onPhaseEnded: (event, context) => event.phase === Phases.Conflict && !context.player.getProvinceCardInProvince(context.source.location).isBroken
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.gainFate(context => ({
                    target: context.player
                })),
                AbilityDsl.actions.gainHonor(context => ({
                    target: context.player
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.player
                }))
            ])
        });
    }
}

PlantedFields.id = 'planted-fields';

module.exports = PlantedFields;
