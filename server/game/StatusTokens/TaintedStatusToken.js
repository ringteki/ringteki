const StatusToken = require('./StatusToken');
const AbilityDsl = require('../abilitydsl');
const { CardTypes, CharacterStatus, EffectNames } = require('../Constants');

class TaintedStatusToken extends StatusToken {
    constructor(game, card) {
        super(game, card, CharacterStatus.Tainted, 'Tainted Token');
    }

    applyEffects() {
        if(!this.card) {
            return;
        }
        let effects = [];
        if(this.card.type === CardTypes.Character) {
            effects.push({
                match: this.card,
                effect: AbilityDsl.effects.modifyBothSkills(2),
                ref: undefined
            });
            effects.push({
                match: this.card,
                condition: () => !this.card.anyEffect(EffectNames.TaintedStatusDoesNotCostHonor),
                effect: AbilityDsl.effects.honorCostToDeclare(1),
                ref: undefined
            });
        } else if(this.card.type === CardTypes.Province) {
            effects.push({
                match: this.card,
                effect: AbilityDsl.effects.modifyProvinceStrength(2),
                ref: undefined
            });
            effects.push({
                match: this.card.controller,
                effect: AbilityDsl.effects.costToDeclareAnyParticipants({
                    type: 'defenders',
                    message: 'loses 1 honor',
                    cost: (player) => AbilityDsl.actions.loseHonor({
                        target: player,
                        amount: 1
                    })
                }),
                ref: undefined
            });
        } else {
            return;
        }
        effects.forEach(effect => {
            this.persistentEffects.push(effect);
            effect.ref = this.addEffectToEngine(effect);
        });
    }
}

module.exports = TaintedStatusToken;
