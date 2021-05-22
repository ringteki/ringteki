const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const EventRegistrar = require('../../eventregistrar');

class BaseOni extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);
    }

    onCardLeavesPlay(event) {
        if(event.card === this) {
            if(this.location !== Locations.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game due to being a Shadowlands character', this);
                this.owner.moveCard(this, Locations.RemovedFromGame);
            }
        }
    }
}

module.exports = BaseOni;
