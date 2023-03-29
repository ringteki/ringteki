const DrawCard = require('../../../drawcard.js');
const PlayAttachmentAction = require('../../../playattachmentaction.js');
const { CardTypes, Durations, Players, Elements } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

const elementKey = 'jealous-ancestor-void';

class PlayAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card, true);
        this.title = 'Play Jealous Ancestor as an attachment';
    }

    executeHandler(context) {
        AbilityDsl.actions
            .cardLastingEffect({
                duration: Durations.Custom,
                canChangeZoneOnce: true,
                effect: AbilityDsl.effects.changeType(CardTypes.Attachment)
            })
            .resolve(this.card, context);
        super.executeHandler(context);
    }
}

class JealousAncestor extends DrawCard {
    setupCardAbilities() {
        this.abilities.playActions.push(new PlayAsAttachment(this));

        this.whileAttached({ effect: AbilityDsl.effects.addTrait('haunted') });
        this.persistentEffect({
            condition: (context) => context.source.parent,
            effect: AbilityDsl.effects.immunity({ restricts: 'events' })
        });

        this.addAttachedEffectOnOpponent(
            AbilityDsl.effects.playerCannot({ cannot: 'draw', restricts: 'opponentsCardEffects' })
        );
        this.addAttachedEffectOnOpponent(AbilityDsl.effects.playerCannot({ cannot: 'move', restricts: 'toHand' }));
        this.addAttachedEffectOnOpponent(AbilityDsl.effects.playerCannot({ cannot: 'returnToHand' }));
    }

    leavesPlay() {
        this.printedType = CardTypes.Character;
        super.leavesPlay();
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Void
        });
        return symbols;
    }

    addAttachedEffectOnOpponent(effect) {
        this.persistentEffect({
            condition: (context) =>
                context.source.parent &&
                context.source.parent.isParticipating() &&
                !this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(
                    context.source.parent.controller
                ),
            targetController: Players.Opponent,
            effect: effect
        });
    }
}

JealousAncestor.id = 'jealous-ancestor';

module.exports = JealousAncestor;
