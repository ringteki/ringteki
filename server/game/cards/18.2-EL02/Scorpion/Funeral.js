const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Stages, Phases, Locations } = require('../../../Constants.js');

class Funeral extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event, context) => {
                    if(context.game.currentPhase === Phases.Draw) {
                        return false;
                    }
                    return event.player === context.player && -event.amount >= context.player.honor && event.context.stage === Stages.Effect;
                },
                onTransferHonor: (event, context) => {
                    if(context.game.currentPhase === Phases.Draw) {
                        return false;
                    }
                    return event.player === context.player && event.amount >= context.player.honor && event.context.stage === Stages.Effect;
                }
            },
            cannotBeMirrored: true,
            effect: 'cancel their honor loss, then gain 1 honor',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor(context => ({ target: context.player })),
                AbilityDsl.actions.removeFromGame(context => ({
                    location: Locations.Any,
                    target: context.source
                }))
            ])
        });
    }
}

Funeral.id = 'funeral';

module.exports = Funeral;
