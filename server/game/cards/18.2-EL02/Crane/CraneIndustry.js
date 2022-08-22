const DrawCard = require('../../../drawcard.js');
const EventRegistrar = require('../../../eventregistrar.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes } = require('../../../Constants');

class CraneIndustry extends DrawCard {
    setupCardAbilities() {
        this.eventsPlayedThisConflict = {};
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'onCardPlayed']);
        this.reaction({
            when: {
                onConflictStarted: () => true
            },
            max: AbilityDsl.limit.perConflict(1),
            title: 'Reduce the cost to play events',
            effect: 'reduce the cost of the first copy of each event they play this conflict by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceCost({
                    amount: 1,
                    match: card => card.type === CardTypes.Event && !this.hasEventBeenPlayed(context, card)
                })
            }))
        });
    }

    hasEventBeenPlayed(context, card) {
        if(!this.eventsPlayedThisConflict[context.player.uuid]) {
            return false;
        }

        return this.eventsPlayedThisConflict[context.player.uuid].includes(card.name);
    }

    onConflictFinished() {
        this.eventsPlayedThisConflict = {};
    }

    onCardPlayed(event) {
        if(event.card.type === CardTypes.Event) {
            if(!this.eventsPlayedThisConflict[event.context.player.uuid]) {
                this.eventsPlayedThisConflict[event.context.player.uuid] = [];
            }
            this.eventsPlayedThisConflict[event.context.player.uuid].push(event.card.name);
        }
    }
}

CraneIndustry.id = 'crane-industry';

module.exports = CraneIndustry;

