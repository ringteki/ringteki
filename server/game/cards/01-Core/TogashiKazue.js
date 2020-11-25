const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes, Durations } = require('../../Constants');

class PlayTogashiKazueAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card, true);
        this.title = 'Play Togashi Kazue as an attachment';
    }

    executeHandler(context) {
        AbilityDsl.actions.cardLastingEffect({
            duration: Durations.Custom,
            canChangeZoneOnce: true,
            effect: AbilityDsl.effects.changeType(CardTypes.Attachment)
        }).resolve(this.card, context);
        super.executeHandler(context);
    }
}

class TogashiKazue extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTogashiKazueAsAttachment(this));
        this.action({
            title: 'Steal a fate',
            condition: context => context.source.type === CardTypes.Attachment && context.source.parent.isParticipating(),
            printedAbility: false,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source.parent,
                gameAction: ability.actions.removeFate(context => ({ recipient: context.source.parent }))
            },
            effect: 'steal a fate from {0} and place it on {1}',
            effectArgs: context => context.source.parent
        });
    }

    leavesPlay() {
        this.printedType = CardTypes.Character;
        super.leavesPlay();
    }
}

TogashiKazue.id = 'togashi-kazue';

module.exports = TogashiKazue;
