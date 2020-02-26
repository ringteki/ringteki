const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ViceProprietor extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            cost: AbilityDsl.costs.dishonorSelf(),
            condition: context => context.source.isParticipating() && context.player.opponent,
            target: {
                player: Players.Opponent,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

ViceProprietor.id = 'vice-proprietor';

module.exports = ViceProprietor;
