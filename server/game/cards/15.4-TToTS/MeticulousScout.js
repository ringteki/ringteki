const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class MeticulousScout extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Blank and reveal a province',
            condition: context => context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2,
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.dishonorProvince(),
                    AbilityDsl.actions.reveal({ chatMessage: true })
                ])
            },
            effect: 'place a dishonor token on {1}, blanking it',
            effectArgs: context => [context.target.isFacedown() ? context.target.location : context.target]
        });
    }
}

MeticulousScout.id = 'meticulous-scout';

module.exports = MeticulousScout;
