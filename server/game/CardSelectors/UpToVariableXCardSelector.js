const BaseCardSelector = require('./BaseCardSelector.js');

class UpToVariableXCardSelector extends BaseCardSelector {
    constructor(numCardsFunc, properties) {
        super(properties);
        this.numCardsFunc = numCardsFunc;
    }

    defaultActivePromptTitle(context) {
        if(this.cardType.length === 1) {
            return this.numCardsFunc(context) === 1 ? 'Select a ' + this.cardType[0] : `Select up to ${this.numCardsFunc(context)} ${this.cardType[0]}s`;
        }
        return this.numCardsFunc(context) === 1 ? 'Select a card' : `Select up to ${this.numCardsFunc(context)} cards`;
    }

    hasReachedLimit(selectedCards, context) {
        return selectedCards.length >= this.numCardsFunc(context);
    }

    hasExceededLimit(selectedCards, context) {
        return selectedCards.length > this.numCardsFunc(context);
    }

    hasEnoughTargets(context, choosingPlayer) {
        return this.numCardsFunc(context) > 0 && super.hasEnoughTargets(context, choosingPlayer);
    }
}

module.exports = UpToVariableXCardSelector;
