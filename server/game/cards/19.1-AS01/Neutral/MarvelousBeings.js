const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { ConflictTypes, CardTypes, Players, Durations } = require('../../../Constants.js');

class MarvelousBeings extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: context => context.game.isDuringConflict(ConflictTypes.Political),
            cost: AbilityDsl.costs.moveToConflict({
                cardCondition: card => (card.hasTrait('spirit') || card.hasTrait('creature')) && card.type === CardTypes.Character
            }),
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                target: context.player,
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.changePlayerSkillModifier(context.costs.moveToConflict ? context.costs.moveToConflict.printedCost : 0)
            })),
            effect: 'entrance the court, giving their side an extra {1}{2} this conflict',
            effectArgs: context => [context.costs.moveToConflict.printedCost, 'political']
        });
    }
}

MarvelousBeings.id = 'marvelous-beings';

module.exports = MarvelousBeings;
