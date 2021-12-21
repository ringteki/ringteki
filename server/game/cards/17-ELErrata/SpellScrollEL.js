const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, CardTypes } = require('../../Constants.js');

class SpellScrollEL extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.source.parent && context.source.parent.isParticipating() && context.game.currentConflict.elements.some(element => context.source.parent.hasTrait(element)),
            effect: AbilityDsl.effects.modifyPoliticalSkill(3)
        });

        this.action({
            title: 'Put a card into your hand',
            condition: context => !!context.source.parent,
            target: {
                location: Locations.ConflictDiscardPile,
                controller: Players.Self,
                cardCondition: (card, context) => {
                    return card.type !== CardTypes.Character && context.source.parent.getTraits().some(trait => card.hasTrait(trait));
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

SpellScrollEL.id = 'spell-scroll-el';

module.exports = SpellScrollEL;
