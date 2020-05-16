const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class BlatantSwindler extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move home a character',
            cost: AbilityDsl.costs.giveHonorToOpponent(1),
            condition: context => context.source.isParticipating() && context.player.opponent,
            target: {
                player: Players.Opponent,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}

BlatantSwindler.id = 'blatant-swindler';

module.exports = BlatantSwindler;
