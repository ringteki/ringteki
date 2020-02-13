const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations } = require('../../Constants');

class AppealToSympathy extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.moveCard(context => ({
                    target: context.event.card,
                    destination: Locations.ConflictDeck
                }))
            ])
        });
    }
}

AppealToSympathy.id = 'appeal-to-sympathy';

module.exports = AppealToSympathy;

