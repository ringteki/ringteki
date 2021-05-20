const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class AudienceChamber extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place fate on character',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === CardTypes.Character && event.card.getCost() >= 4
            },
            gameAction: AbilityDsl.actions.placeFate(context => ({
                target: context.event.card
            }))
        });
    }
}

AudienceChamber.id = 'audience-chamber';

module.exports = AudienceChamber;
