const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class ArrowsFromTheWoods extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce opponent\'s characters mil',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardCondition: (card, context) => card.controller === context.player && card.isParticipating() && card.hasTrait('bushi')
            },
            gameAction: AbilityDsl.actions.conditional({
                condition: context => context.target.hasTrait('shinobi'),
                trueGameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.game.currentConflict.getCharacters(context.player.opponent),
                    effect: AbilityDsl.effects.modifyBothSkills(-2)
                })),
                falseGameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.game.currentConflict.getCharacters(context.player.opponent),
                    effect: AbilityDsl.effects.modifyBothSkills(-1)
                })),
            }),
            effect: 'give {1}\'s participating characters -{2}{3}',
            effectArgs: context => [context.player.opponent, context.target.hasTrait('shinobi') ? '2' : '1', 'military']
        });
    }
}

ArrowsFromTheWoods.id = 'arrows-from-the-woods';

module.exports = ArrowsFromTheWoods;