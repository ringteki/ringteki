const ProvinceCard = require('../../provincecard.js');
const EventRegistrar = require('../../eventregistrar.js');
const {EventNames, AbilityTypes} = require('../../Constants');
class Pilgrimage extends ProvinceCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([{
            [EventNames.OnResolveRingElement + ':' + AbilityTypes.WouldInterrupt]: 'cancelRingEffect'
        }]);
    }

    cancelRingEffect(event) {
        if(!this.isBroken && !this.isBlank() && event.context.game.currentConflict && event.context.game.currentConflict.conflictProvince === this && !event.cancelled) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}

Pilgrimage.id = 'pilgrimage';

module.exports = Pilgrimage;
