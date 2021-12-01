const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, Players } = require('../../../Constants.js');

class SpellScrollReprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return a spell to your hand',
            condition: context => !!context.source.parent,
            target: {
                location: Locations.ConflictDiscardPile,
                controller: Players.Self,
                cardCondition: (card, context) => {
                    return card.hasTrait('spell') && context.source.parent.getTraits().some(trait => card.hasTrait(trait));
                },
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.target,
                        destination: Locations.Hand
                    })),
                    AbilityDsl.actions.sacrifice(context => ({ target: context.source }))
                ])
            },
            effect: 'move {1} to their hand and sacrifice {2}',
            effectArgs: context => [context.target, context.source]
        });
    }
}

SpellScrollReprint.id = 's-c-r-o-l-l';

module.exports = SpellScrollReprint;
