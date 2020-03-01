const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const EventRegistrar = require('../../eventregistrar');

class PerfectGuest extends DrawCard {
    setupCardAbilities() {
        this.triggeredThisRound = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onRoundEnded']);

        this.action({
            title: 'Give control of this character',
            condition: () => !this.triggeredThisRound,
            gameAction: AbilityDsl.actions.cardLastingEffect(context => {
                this.triggeredThisRound = true;
                return ({
                    effect: AbilityDsl.effects.takeControl(context.player.opponent),
                    duration: Durations.Custom
                });
            })
        });
    }

    onRoundEnded() {
        this.triggeredThisRound = false;
    }
}

PerfectGuest.id = 'perfect-guest';

module.exports = PerfectGuest;
