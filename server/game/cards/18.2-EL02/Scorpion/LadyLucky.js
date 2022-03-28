const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class LadyLuck extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => this.getFavorSide(context) === 'military',
            match: card => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.persistentEffect({
            condition: context => this.getFavorSide(context) === 'political',
            match: card => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.modifyPoliticalSkill(1)
        });
    }

    getFavorSide(context) {
        if(context.player.imperialFavor) {
            return context.player.imperialFavor;
        }
        if(context.player.opponent) {
            return context.player.opponent.imperialFavor;
        }
        return undefined;
    }
}

LadyLuck.id = 'lady-luck';

module.exports = LadyLuck;
