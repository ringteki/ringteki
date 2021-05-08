const StatusToken = require('./StatusToken');
const AbilityDsl = require('../abilitydsl');
const { CardTypes, CharacterStatus } = require('../Constants');

class DishonoredStatusToken extends StatusToken {
    constructor(game, card) {
        super(game, card, CharacterStatus.Dishonored, 'Dishonored Token');
    }

    applyEffects() {
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
}

module.exports = DishonoredStatusToken;
