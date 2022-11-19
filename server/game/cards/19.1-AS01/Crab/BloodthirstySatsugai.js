const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes } = require('../../../Constants');
const EventRegistrar = require('../../../eventregistrar');
const AbilityDsl = require('../../../abilitydsl.js');

class BloodthirstySatsugai extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);

        this.action({
            title: 'Put this into play',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character
            }),
            location: [Locations.Provinces, Locations.DynastyDiscardPile],
            gameAction: AbilityDsl.actions.putIntoPlay()
        });
    }

    onCardLeavesPlay(event) {
        if(event.card === this) {
            if(this.location !== Locations.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game due to leaving play', this);
                this.owner.moveCard(this, Locations.RemovedFromGame);
            }
        }
    }
}

BloodthirstySatsugai.id = 'bloodthirsty-satsugai';

module.exports = BloodthirstySatsugai;
