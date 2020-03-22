const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AkodoReserveCompany extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: () => this.game.isDuringConflict() && this.isBattlefieldInPlay(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card.controller === context.player,
                gameAction: AbilityDsl.actions.joint([
                    AbilityDsl.actions.moveToConflict(context => ({ target: context.source })),
                    AbilityDsl.actions.sendHome()
                ])
            }
        });
    }

    isBattlefieldInPlay() {
        return this.game.allCards.some(card => {
            return card.hasTrait('battlefield') && !card.facedown &&
            (card.location === Locations.PlayArea || (card.isProvince && !card.isBroken) || (card.isInProvince() && card.type === CardTypes.Holding));
        });
    }

}

AkodoReserveCompany.id = 'akodo-reserve-company';

module.exports = AkodoReserveCompany;
