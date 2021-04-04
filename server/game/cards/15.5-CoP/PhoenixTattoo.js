const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class PhoenixTattoo extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('tattooed')
        });

        this.persistentEffect({
            targetController: Players.Any,
            match: (card, context) => context.source.parent && card !== context.source.parent && card.isParticipating() && context.game.isDuringConflict('political'),
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }
}

PhoenixTattoo.id = 'phoenix-tattoo';

module.exports = PhoenixTattoo;
