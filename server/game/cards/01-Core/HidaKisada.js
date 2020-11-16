const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const { Locations, CardTypes, EventNames, AbilityTypes } = require('../../Constants');

class HidaKisada extends DrawCard {
    setupCardAbilities() {
        this.firstActionEvent = {};

        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([{
            [EventNames.OnInitiateAbilityEffects + ':' + AbilityTypes.WouldInterrupt]: 'onInitiateAbilityEffectsWouldInterrupt'
        }]);
        this.abilityRegistrar.register([{
            [EventNames.OnInitiateAbilityEffects + ':' + AbilityTypes.OtherEffects]: 'onInitiateAbilityEffectsOtherEffects'
        }]);
        this.abilityRegistrar.register([
            EventNames.OnConflictDeclared
        ]);
    }

    onInitiateAbilityEffectsWouldInterrupt(event) {
        if(!this.firstActionEvent[event.context.player.uuid] && this.game.isDuringConflict() && event.context.ability.abilityType === 'action' && !event.context.ability.cannotBeCancelled) {
            this.firstActionEvent[event.context.player.uuid] = event;
        }
    }

    onInitiateAbilityEffectsOtherEffects(event) {
        if(event === this.firstActionEvent[event.context.player.uuid] && event.context.player === this.controller.opponent && !event.cancelled && this.location === Locations.PlayArea && !this.isBlank() && !this.game.conflictRecord.some(conflict => conflict.winner === this.controller.opponent)) {
            event.cancel();
            this.game.addMessage('{0} attempts to initiate {1}{2}, but {3} cancels it', event.context.player, event.card, event.card.type === CardTypes.Event ? '' : '\'s ability', this);
        }
    }

    onConflictDeclared() {
        this.firstActionEvent = {};
    }
}

HidaKisada.id = 'hida-kisada';

module.exports = HidaKisada;
