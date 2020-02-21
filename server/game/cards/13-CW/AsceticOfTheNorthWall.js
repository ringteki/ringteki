const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AsceticOfTheNorthWall extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.rings.earth.isConsideredClaimed(context.player) && context.game.currentPhase !== Phases.Fate,
            effect: [
                AbilityDsl.effects.cardCannot('removeFate'),
                AbilityDsl.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}

AsceticOfTheNorthWall.id = 'ascetic-of-the-north-wall';

module.exports = AsceticOfTheNorthWall;
