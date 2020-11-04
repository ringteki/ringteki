const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AgashaSwordsmith extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search top 5 card for attachment',
            limit: AbilityDsl.limit.perRound(1),
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: card => card.type === CardTypes.Attachment,
                gameAction: AbilityDsl.actions.moveCard({ 
                    destination: Locations.Hand
                })
            })
        });
    }
}

AgashaSwordsmith.id = 'agasha-swordsmith';

module.exports = AgashaSwordsmith;

