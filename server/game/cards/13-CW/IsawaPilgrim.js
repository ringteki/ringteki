const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class IsawaPilgrim extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give control of this character',
            condition: context => context.player.opponent && context.game.rings.water.isConsideredClaimed(context.player.opponent),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.takeControl(context.player.opponent),
                duration: Durations.Custom
            }))
        });
    }
}

IsawaPilgrim.id = 'isawa-pilgrim';

module.exports = IsawaPilgrim;
