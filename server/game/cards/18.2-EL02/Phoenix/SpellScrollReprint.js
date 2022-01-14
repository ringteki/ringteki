const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations } = require('../../../Constants.js');

class SpellScrollReprint extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: ['shugenja', 'scholar']
        });

        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 4,
                cardCondition: card => card.hasTrait('spell'),
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}

SpellScrollReprint.id = 's-c-r-o-l-l';

module.exports = SpellScrollReprint;
