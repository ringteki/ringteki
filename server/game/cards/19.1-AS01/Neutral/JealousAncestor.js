const DrawCard = require('../../../drawcard.js');
const PlayAttachmentAction = require('../../../playattachmentaction.js');
const { CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class PlayAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card, true);
        this.title = 'Play Jealous Ancestor as an attachment';
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

// TODO: Add the card thing
class JealousAncestor extends DrawCard {
    setupCardAbilities() {
        this.abilities.playActions.push(new PlayAsAttachment(this));
        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('haunted')
        });
        this.persistentEffect({
            condition: context => context.source.parent,
            effect: AbilityDsl.effects.immunity({
                restricts: 'events'
            })
        });
    }

    leavesPlay() {
        this.printedType = CardTypes.Character;
        super.leavesPlay();
    }
}

JealousAncestor.id = 'jealous-ancestor';

module.exports = JealousAncestor;
