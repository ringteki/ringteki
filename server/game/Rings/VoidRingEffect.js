const GameModes = require('../../GameModes.js');
const BaseAbility = require('../baseability.js');
const { CardTypes } = require('../Constants');

class VoidRingEffect extends BaseAbility {
    constructor(optional = true, gameMode = GameModes.Stronghold) { // eslint-disable-line no-unused-vars
        super({
            target: {
                activePromptTitle: 'Choose character to remove fate from',
                source: 'Void Ring',
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : [],
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.allowGameAction('removeFate', context)
            }
        });

        this.cannotTargetFirst = true;
        this.title = 'Void Ring Effect';
        this.defaultPriority = 2; // Default resolution priority when players have ordering switched off
    }

    executeHandler(context) {
        if(context.target) {
            context.game.addMessage('{0} resolves the {1} ring, removing a fate from {2}', context.player, 'void', context.target);
            context.game.applyGameAction(context, { removeFate: context.target });
        } else {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, 'void');
        }
    }
}

module.exports = VoidRingEffect;
