const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class ArrowsFromTheWoods extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce opponent\'s characters mil',
            condition: (context) =>
                context.game.isDuringConflict('military') &&
                context.player.anyCardsInPlay((card) => card.isParticipating() && card.hasTrait('bushi')),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.game.currentConflict.getCharacters(context.player.opponent),
                effect: AbilityDsl.effects.modifyMilitarySkill(this._arrowsPenalty(context))
            })),
            effect: 'give {1}\'s participating characters {2}{3}',
            effectArgs: (context) => [context.player.opponent, this._arrowsPenalty(context), 'military'],
            max: AbilityDsl.limit.perConflict(1)
        });
    }

    _arrowsPenalty(context) {
        let hasScoutOrShinobiParticipating = context.player.anyCardsInPlay(
            (card) => card.isParticipating() && (card.hasTrait('scout') || card.hasTrait('shinobi'))
        );
        return hasScoutOrShinobiParticipating ? -2 : -1;
    }
}

ArrowsFromTheWoods.id = 'arrows-from-the-woods';

module.exports = ArrowsFromTheWoods;
