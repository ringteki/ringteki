const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const EventRegistrar = require('../../../eventregistrar.js');
import { Locations, CardTypes, PlayTypes, EventNames } from '../../../Constants.js';

class ChainOfCommand extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnCardPlayed]);

        this.persistentEffect({
            location: Locations.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDiscardPile, [this], this, PlayTypes.Other)
        });
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: card => !card.isUnique()
            }),
            target: {
                activePromptTitle: 'Choose a unique character',
                cardType: CardTypes.Character,
                cardCondition: card => card.isUnique(),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }

    onCardPlayed(event) {
        if(event.card === this) {
            if(this.location !== Locations.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game due the effects of {0}', this);
                this.owner.moveCard(this, Locations.RemovedFromGame);
            }
        }
    }
}

ChainOfCommand.id = 'chain-of-command';

module.exports = ChainOfCommand;
