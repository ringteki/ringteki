const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const EventRegistrar = require('../../../eventregistrar.js');
const { Stages, Phases, Locations, FavorTypes, EventNames } = require('../../../Constants.js');

class Funeral extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnCardPlayed]);

        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event, context) => {
                    return event.player === context.player && -event.amount >= context.player.honor && event.context.stage === Stages.Effect;
                },
                onTransferHonor: (event, context) => {
                    return event.player === context.player && event.amount >= context.player.honor && event.context.stage === Stages.Effect;
                }
            },
            cannotBeMirrored: true,
            effect: 'cancel their honor loss, then gain 1 honor',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor(context => ({ target: context.player }))
            ])
        });
    }

    canPlay(context, playType) {
        if(context.game.currentPhase === Phases.Draw) {
            return false;
        }

        if(context.game.getFavorSide() !== FavorTypes.Political) {
            return false;
        }

        return super.canPlay(context, playType);
    }

    onCardPlayed(event) {
        if(event.card === this) {
            if(this.location !== Locations.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game due the effects of {0}', this);
                this.owner.moveCard(this, Locations.RemovedFromGame);
            }
        }
    }
}

Funeral.id = 'funeral';

module.exports = Funeral;
