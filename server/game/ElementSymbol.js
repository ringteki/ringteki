const EffectSource = require('./EffectSource');

class ElementSymbol extends EffectSource {
    constructor(game, card, info) {
        super(game, `${info.prettyName} (${info.element})`);
        this.card = card;
        this.key = info.key;
        this.prettyName = info.prettyName;
        this.element = info.element;
        this.printedType = 'elementSymbol';
        this.persistentEffects = [];
    }
}

module.exports = ElementSymbol;
