const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AlchemicalLaboratory extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                this.game.rings.fire.isConsideredClaimed(context.player)
            ),
            match: (card, context) => card.getType() === CardTypes.Attachment && card.parent && card.parent.controller !== context.player,
            effect: AbilityDsl.effects.addKeyword('ancestral'),
            targetController: Players.Self
        });
    }
}

AlchemicalLaboratory.id = 'alchemical-laboratory';

module.exports = AlchemicalLaboratory;
