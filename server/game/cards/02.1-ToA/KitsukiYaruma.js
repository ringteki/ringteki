const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations } = require('../../Constants');

class KitsukiYaruma extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Flip province facedown',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => !card.isBroken,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }

    allowAttachment(attachment) {
        if (attachment.hasTrait('poison') && !this.isBlank()) {
            return false;
        }

        return super.allowAttachment(attachment);
    }
}

KitsukiYaruma.id = 'kitsuki-yaruma';

module.exports = KitsukiYaruma;
