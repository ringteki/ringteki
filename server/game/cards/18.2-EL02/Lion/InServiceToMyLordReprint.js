import { Locations, CardTypes, PlayTypes } from '../../../Constants.js';
const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class InServiceToMyLordReprint extends DrawCard {
    setupCardAbilities() {
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
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.removeFromGame(context => ({
                        location: Locations.Any,
                        target: context.source
                    }))
                ])
            },
            effect: 'ready {0} and remove {1} from the game',
            effectArgs: context => [
                context.source,
                context.source.owner]
        });
    }
}

InServiceToMyLordReprint.id = 'how-to-serve-my-lord';

module.exports = InServiceToMyLordReprint;
