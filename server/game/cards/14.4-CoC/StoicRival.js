const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class StoicRival extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor a participating character with fewer attachments',
            condition: context => context.source.attachments.size() > 0 && context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card,context) => card.isParticipating() && card.attachments.size() <context.source.attachments.size(),
                gameAction: ability.actions.dishonor()            
			}
        });
    }
}

NitenAdept.id = 'stoic-rival';

module.exports = StoicRival;
