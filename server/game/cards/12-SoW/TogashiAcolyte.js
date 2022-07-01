const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class PlayTogashiAcolyteAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card, true);
        this.title = 'Play Togashi Acolyte as an attachment';
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

class TogashiAcolyte extends DrawCard {
    setupCardAbilities() {
        this.abilities.playActions.push(new PlayTogashiAcolyteAsAttachment(this));
        this.reaction({
            title: 'Give attached character +1/+1',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => context.source.parent && event.player === context.player && context.source.type === CardTypes.Attachment && context.source.parent.isParticipating()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyBothSkills(1)
            })),
            effect: 'give +1{1} and +1{2} to {3}',
            effectArgs: context => ['political', 'military', context.source.parent]
        });
    }

    leavesPlay() {
        this.printedType = CardTypes.Character;
        super.leavesPlay();
    }
}

TogashiAcolyte.id = 'togashi-acolyte';

module.exports = TogashiAcolyte;
