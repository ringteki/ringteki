const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AkodoReserveCompany extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: () => this.game.isDuringConflict() && this.game.allCards.some(card => card.hasTrait('battlefield') && card.location.includes(Locations.PlayArea)),
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
}

AkodoReserveCompany.id = 'akodo-reserve-company';

module.exports = AkodoReserveCompany;
