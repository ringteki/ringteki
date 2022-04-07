const DrawCard = require('../../../drawcard.js');
const { TargetModes, CardTypes, AbilityTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class CraftyTsukumogami extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Attach to a ring',
            condition: context => this.checkTriggeringCondition(context),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring to attach to',
                ringCondition: () => true,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        canChangeZoneOnce: true,
                        duration: Durations.Custom,
                        target: context.source,
                        effect: [
                            AbilityDsl.effects.changeType(CardTypes.Attachment),
                            AbilityDsl.effects.gainAbility(AbilityTypes.ForcedReaction, {
                                title: 'Discard a card',
                                limit: AbilityDsl.limit.unlimitedPerConflict(),
                                when: {
                                    onConflictDeclared: (event, context) => context.source.parent && context.source.parent === event.ring
                                },
                                printedAbility: false,
                                gameAction: AbilityDsl.actions.chosenDiscard(context => ({
                                    target: context.game.currentConflict.attackingPlayer,
                                    amount: 1
                                }))
                            })
                        ]
                    })),
                    AbilityDsl.actions.attachToRing(context => ({
                        attachment: context.source
                    }))
                ])
            },
            effect: 'attach itself to the {0}'
        });
    }

    checkTriggeringCondition(context) {
        let ringAttachments = [];
        Object.values(context.game.rings).forEach(ring => {
            ringAttachments = [...ringAttachments, ...ring.attachments];
        });

        return !ringAttachments.some(a => a.name === context.source.name && a.controller === context.player);
    }

    canAttach(ring) {
        return ring && ring.type === 'ring' && this.getType() === CardTypes.Attachment;
    }
    canPlayOn(source) {
        return source && source.getType() === 'ring' && this.getType() === CardTypes.Attachment;
    }
    mustAttachToRing() {
        return this.getType() === CardTypes.Attachment;
    }
}

CraftyTsukumogami.id = 'crafty-tsukumogami';
module.exports = CraftyTsukumogami;
