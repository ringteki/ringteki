const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Stages, Phases, Locations } = require('../../../Constants.js');

class DutyReprint extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event, context) => context.game.currentPhase !== Phases.Draw &&
                    event.player === context.player && -event.amount >= context.player.honor && event.context.stage === Stages.Effect,
                onTransferHonor: (event, context) => context.game.currentPhase !== Phases.Draw &&
                    event.player === context.player && event.amount >= context.player.honor && event.context.stage === Stages.Effect
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

DutyReprint.id = 'duty-2-electric-boogaloo';

module.exports = DutyReprint;
