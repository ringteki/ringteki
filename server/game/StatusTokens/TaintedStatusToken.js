const StatusToken = require('./StatusToken');
const AbilityDsl = require('../abilitydsl');
const { CardTypes, CharacterStatus } = require('../Constants');

class TaintedStatusToken extends StatusToken {
    constructor(game, card) {
        super(game, card, CharacterStatus.Tainted, 'Tainted Token');
    }

    applyEffects() {
        if(!this.card) {
            return;
        }
        let effect = undefined;
        if(this.card.type === CardTypes.Character) {
            effect = {
                match: this.card,
                effect: AbilityDsl.effects.modifyBothSkills(2),
                ref: undefined
            };
        } else if(this.card.type === CardTypes.Province) {
            effect = {
                match: this.card,
                effect: AbilityDsl.effects.modifyProvinceStrength(2),
                ref: undefined
            };
        } else {
            return;
        }
        this.persistentEffects.push(effect);
        effect.ref = this.addEffectToEngine(effect);
    }
}

module.exports = TaintedStatusToken;
