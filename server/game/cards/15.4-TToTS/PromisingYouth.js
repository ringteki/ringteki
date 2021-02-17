const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class PlayPromisingYouthAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card, true);
        this.title = 'Play Promising Youth as an attachment';
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

class PromisingYouth extends DrawCard {
    setupCardAbilities() {
        this.abilities.playActions.push(new PlayPromisingYouthAsAttachment(this));
        this.whileAttached({
            effect: AbilityDsl.effects.modifyBothSkills(2)
        });
        this.interrupt({
            title: 'when attached char leaves play, turn into character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.detach(),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    duration: Durations.Custom,
                    effect: AbilityDsl.effects.changeType(CardTypes.Character)
                }))
            ])
        });
    }

    leavesPlay() {
        this.printedType = CardTypes.Character;
        super.leavesPlay();
    }
}

PromisingYouth.id = 'promising-youth';

module.exports = PromisingYouth;
