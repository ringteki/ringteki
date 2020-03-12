const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Durations } = require('../../Constants');

class SevenStingsKeep extends StrongholdCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Special Conflict',
            when: { 
                onConflictOpportunityAvailable: (event, context) => event.player === context.player 
            },
            cost: [AbilityDsl.costs.bowSelf()],
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card.type === CardTypes.Event)
            })
        });
    }
}

SevenStingsKeep.id = 'seven-stings-keep';
module.exports = SevenStingsKeep;

