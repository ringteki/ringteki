const StatusToken = require('./StatusToken');
const AbilityDsl = require('../abilitydsl');
const { CardTypes, CharacterStatus } = require('../Constants');

class HonoredStatusToken extends StatusToken {
    constructor(game, card, isHonored) {
        super(game, 'Honored Token');
        this.grantedStatus = CharacterStatus.Honored;
        this.parent = card;
        this.card = card;
        this.printedType = 'token';
        this.persistentEffects = [];

        this.applyHonorEffects();
    }

    applyHonorEffects() {
        if(!this.card || this.card.type !== CardTypes.Character) {
            return;
        }
        let amount = this.honored ? card => card.getGlory() : card => 0 - card.getGlory();
        let effect = {
            match: this.card,
            effect: AbilityDsl.effects.modifyBothSkills(amount)
        };
        this.persistentEffects.push(effect);
        effect.ref = this.addEffectToEngine(effect);
    }

    removeHonorEffects() {
        this.persistentEffects.forEach(effect => {
            this.removeEffectFromEngine(effect.ref);
            effect.ref = [];
        });
        this.persistentEffects = [];
    }

    setCard(card) {
        this.removeHonorEffects();
        this.card = card;
        this.applyHonorEffects();
    }
}

module.exports = StatusToken;
