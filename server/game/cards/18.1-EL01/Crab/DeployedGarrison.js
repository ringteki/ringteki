const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');
const EventRegistrar = require('../../../eventregistrar');

class DeployedGarrison extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);

        this.action({
            title: 'Sacrifice a holding to put this character into play',
            location: Locations.DynastyDiscardPile,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Holding
            }),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.putIntoConflict(context => ({
                    target: context.source
                }))
            ])
        });
    }

    onCardLeavesPlay(event) {
        if(event.card === this && !event.card.isBlank()) {
            if(this.location !== Locations.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game due to their effect', this);
                this.owner.moveCard(this, Locations.RemovedFromGame);
            }
        }
    }
}

DeployedGarrison.id = 'deployed-garrison';

module.exports = DeployedGarrison;
