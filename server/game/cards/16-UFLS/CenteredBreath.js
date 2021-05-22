const DrawCard = require('../../drawcard.js');
const { Durations, Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const EventRegistrar = require('../../eventregistrar');

class CenteredBreath extends DrawCard {
    setupCardAbilities() {
        this.kihoPlayedThisConflict = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'onCardPlayed']);

        this.action({
            title: 'Add an additional ability use to a monk',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.hasTrait('monk') && card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfRound,
                        effect: AbilityDsl.effects.increaseLimitOnPrintedAbilities()
                    }),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        duration: Durations.UntilPassPriority,
                        effect: this.isKihoPlayed(context) ? AbilityDsl.effects.additionalAction() : []
                    }))
                ])
            },
            effect: 'add an additional use to each of {0}\'s printed abilities{1}',
            effectArgs: context => [this.isKihoPlayed(context) ? ' and take an additional action' : '']
        });
    }


    //in case there's a "You are considered to have played a kiho" effect printed at some point, you can put that in here
    isKihoPlayed(context) { // eslint-disable-line no-unused-vars
        return this.kihoPlayedThisConflict;
    }

    onConflictFinished() {
        this.kihoPlayedThisConflict = false;
    }

    onCardPlayed(event) {
        if(event && event.context.player === this.controller && event.context.source.hasTrait('kiho')) {
            this.kihoPlayedThisConflict = true;
        }
    }
}

CenteredBreath.id = 'centered-breath';

module.exports = CenteredBreath;
