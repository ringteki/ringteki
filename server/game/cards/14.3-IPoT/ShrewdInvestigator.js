const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class ShrewdInvestigator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at random cards from your opponent\'s hand',
            condition: context => context.source.isParticipating() && context.player.opponent,
            gameAction: AbilityDsl.actions.lookAt(context => ({
                target: context.player.opponent.hand.shuffle().slice(0, context.player.getNumberOfFacedownProvinces()).sort((a, b) => a.name.localeCompare(b.name))
            })),
            effect: 'look at {1} random card{3} in {2}\'s hand',
            effectArgs: context => [context.player.getNumberOfFacedownProvinces(), context.player.opponent, context.player.getNumberOfFacedownProvinces() === 1 ? '' : 's']
        });
    }
}

ShrewdInvestigator.id = 'shrewd-investigator';

module.exports = ShrewdInvestigator;
