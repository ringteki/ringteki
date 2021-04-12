const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class GoldenPlains extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.controller === context.player,
            targetController: Players.Self,
            effect: AbilityDsl.effects.addTrait('cavalry'),
            condition: context => context.player.stronghold.name === 'Golden Plains Outpost'
        });

        this.reaction({
            title: 'Move the conflict',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }
}

GoldenPlains.id = 'golden-plains';

module.exports = GoldenPlains;
