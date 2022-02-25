const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CharacterStatus } = require('../../../Constants');

class LuckyCoin extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.game.isDuringConflict() && context.source.parent && context.source.parent.isDishonored,
            effect: [
                AbilityDsl.effects.honorStatusDoesNotModifySkill(),
                AbilityDsl.effects.honorStatusDoesNotAffectLeavePlay()
            ]
        });

        this.action({
            title: 'Discard status token',
            condition: context => context.source.parent && context.source.parent.hasTrait('courtier') && context.source.parent.isDishonored,
            gameAction: AbilityDsl.actions.discardStatusToken(context => ({ target: context.source.parent.getStatusToken(CharacterStatus.Dishonored) }))
        });
    }
}

LuckyCoin.id = 'lucky-coin';

module.exports = LuckyCoin;
