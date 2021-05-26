const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const { Locations, Phases, CardTypes, EventNames } = require('../../Constants');

class SoshiShadowshaper extends DrawCard {
    setupCardAbilities(ability) {
        this.charactersPlayedThisPhase = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnPhaseStarted, EventNames.OnCharacterEntersPlay]);

        this.action({
            title: 'Return a character to owner\'s hand',
            phase: Phases.Conflict,
            cost: ability.costs.payHonor(1),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.getCost() < 3 && this.charactersPlayedThisPhase.includes(card),
                gameAction: ability.actions.returnToHand()
            }
        });
    }

    onPhaseStarted() {
        this.charactersPlayedThisPhase = [];
    }

    onCharacterEntersPlay(event) {
        if(event.originalLocation === Locations.Hand) {
            this.charactersPlayedThisPhase.push(event.card);
        }
    }
}

SoshiShadowshaper.id = 'soshi-shadowshaper';

module.exports = SoshiShadowshaper;
