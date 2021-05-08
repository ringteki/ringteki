const EffectSource = require('../EffectSource');

class StatusToken extends EffectSource {
    constructor(game, card, status, title) {
        super(game, title);
        this.card = card;
        this.printedType = 'token';
        this.persistentEffects = [];
        this.grantedStatus = status;

        this.applyEffects();
    }

    applyEffects() {
    }

    removeEffects() {
        this.persistentEffects.forEach(effect => {
            this.removeEffectFromEngine(effect.ref);
            effect.ref = [];
        });
        this.persistentEffects = [];
    }

    setCard(card) {
        this.removeEffects();
        this.card = card;
        this.applyEffects();
    }
}

module.exports = StatusToken;
