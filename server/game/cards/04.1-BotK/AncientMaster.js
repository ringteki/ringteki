const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes, Locations, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class PlayAncientMasterAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card, true);
        this.title = 'Play Ancient Master as an attachment';
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

class AncientMaster extends DrawCard {
    setupCardAbilities() {
        this.abilities.playActions.push(new PlayAncientMasterAsAttachment(this));
        this.reaction({
            title: 'Search top 5 card for kiho or tattoo',
            when: {
                onConflictDeclared: (event, context) => context.source.type === CardTypes.Attachment && event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) => context.source.type === CardTypes.Attachment && event.defenders.includes(context.source.parent)
            },
            printedAbility: false,
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: card => card.hasTrait('kiho') || card.hasTrait('tattoo'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }

    leavesPlay() {
        this.printedType = CardTypes.Character;
        super.leavesPlay();
    }
}

AncientMaster.id = 'ancient-master';

module.exports = AncientMaster;
