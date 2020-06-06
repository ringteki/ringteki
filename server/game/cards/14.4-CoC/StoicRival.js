const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class StoicRival extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor a participating character with fewer attachments',
            condition: context => context.source.attachments.size() > 0 && context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card,context) => card.isParticipating() && card.attachments.size() < context.source.attachments.size(),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}

StoicRival.id = 'stoic-rival';

module.exports = StoicRival;
