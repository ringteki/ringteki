const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes, Durations, Locations, Players } = require('../../Constants');

class PlaySereneIseZumiAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card, true);
        this.title = 'Play Serene Ise Zumi as an attachment';
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

class SereneIseZumi extends DrawCard {
    setupCardAbilities() {
        this.abilities.playActions.push(new PlaySereneIseZumiAsAttachment(this));
        this.attachmentConditions({
            myControl: true
        });
        this.action({
            title: 'Move attached character home',
            printedAbility: false,
            condition: context => context.game.isDuringConflict() && context.source.type === CardTypes.Attachment && context.source.parent.isParticipating(),
            gameAction: AbilityDsl.actions.sendHome(context => ({
                target: context.source.parent
            }))
        });
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            condition: context => context.source.type === CardTypes.Attachment,
            effect: AbilityDsl.effects.loseKeyword('sincerity')
        });
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 2,
                targetCondition: target => target.type === CardTypes.Character,
                match: (card, source) => card === source
            })
        });
    }
}

SereneIseZumi.id = 'serene-ise-zumi';

module.exports = SereneIseZumi;
