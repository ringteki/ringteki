const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, CardTypes } = require('../../Constants.js');

class SpellScroll extends DrawCard {
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
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            }
        });
    }
}

SpellScroll.id = 'spell-scroll';

module.exports = SpellScroll;
