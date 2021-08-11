const EffectSource = require('../EffectSource');
const AbilityDsl = require('../abilitydsl');
const { CardTypes, CharacterStatus, EffectNames } = require('../Constants');

class StatusToken extends EffectSource {
    constructor(game, card, status, title) {
        super(game, title);
        this.card = card;
        this.printedType = 'token';
        this.persistentEffects = [];
        this._grantedStatus = status;
        this.overrideStatus = undefined;

        this.applyEffects();
    }

    get controller() {
        return this.card.controller;
    }

    get grantedStatus() {
        if(this.overrideStatus) {
            return this.overrideStatus;
        }
        return this._grantedStatus;
    }

    applyEffects() {
        if(this.grantedStatus === CharacterStatus.Honored) {
            this.applyHonoredEffect();
        } else if(this.grantedStatus === CharacterStatus.Dishonored) {
            this.applyDishonoredEffect();
        } else if(this.grantedStatus === CharacterStatus.Tainted) {
            this.applyTaintedEffect();
        }
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

    applyDishonoredEffect() {
        if(!this.card || this.card.type !== CardTypes.Character) {
            return;
        }
        let effect = {
            match: this.card,
            effect: AbilityDsl.effects.modifyBothSkills(card => -card.getGlory())
        };
        this.persistentEffects.push(effect);
        effect.ref = this.addEffectToEngine(effect);
    }

    applyHonoredEffect() {
        if(!this.card || this.card.type !== CardTypes.Character) {
            return;
        }
        let effect = {
            match: this.card,
            effect: AbilityDsl.effects.modifyBothSkills(card => card.getGlory())
        };
        this.persistentEffects.push(effect);
        effect.ref = this.addEffectToEngine(effect);
    }

    applyTaintedEffect() {
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
                condition: () => !(this.card.game.currentConflict && this.card.game.currentConflict.anyEffect(EffectNames.ConflictIgnoreStatusTokens) && this.card.isConflictProvince()),
                effect: AbilityDsl.effects.modifyProvinceStrength(2),
                ref: undefined
            });
            effects.push({
                match: this.card.controller,
                condition: () => this.card.isConflictProvince(),
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

module.exports = StatusToken;
