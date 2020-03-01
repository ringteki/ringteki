const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ASeasonOfWar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard all cards from provinces,  refill faceup, and start a new dynasty phase',
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.player.getDynastyCardsInProvince(Locations.Provinces).concat(context.player.opponent ?
                    context.player.opponent.getDynastyCardsInProvince(Locations.Provinces) : []),
                refillFaceUp: true
            }))
        });
    }
}

ASeasonOfWar.id = 'a-season-of-war';

module.exports = ASeasonOfWar;
