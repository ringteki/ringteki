const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ChroniclerOfConquests extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain 1 honor',
            condition: context => context.source.isParticipating() && this.isBattlefieldInPlay(),
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.player
            }))
        });
    }

    isBattlefieldInPlay() {
        return this.game.allCards.some(card => {
            return card.hasTrait('battlefield') && !card.facedown &&
            (card.location === Locations.PlayArea || (card.isProvince && !card.isBroken) || (card.isInProvince() && card.type === CardTypes.Holding));
        });
    }
}

ChroniclerOfConquests.id = 'chronicler-of-conquests';

module.exports = ChroniclerOfConquests;
