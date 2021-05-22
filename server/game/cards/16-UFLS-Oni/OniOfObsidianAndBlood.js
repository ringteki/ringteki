const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class OniOfObsidianAndBlood extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Discard a character',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            target: {
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                cardCondition: card => card.isTainted,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }

    allowAttachment(attachment) {
        if(!attachment.isFaction('shadowlands') && !attachment.hasTrait('shadowlands')) {
            return false;
        }

        return super.allowAttachment(attachment);
    }
}

OniOfObsidianAndBlood.id = 'oni-of-obsidian-and-blood';

module.exports = OniOfObsidianAndBlood;
