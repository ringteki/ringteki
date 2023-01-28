const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class VillageDoshin extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            location: Locations.Hand,
            cost: AbilityDsl.costs.discardSelf(),
            when: {
                onInitiateAbilityEffects: (event, context) => event.context.ability.isTriggeredAbility() && event.cardTargets.some(card => (
                    card.type === CardTypes.Attachment && card.controller === context.player && card.location === Locations.PlayArea)
                )
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

VillageDoshin.id = 'village-doshin';

module.exports = VillageDoshin;
