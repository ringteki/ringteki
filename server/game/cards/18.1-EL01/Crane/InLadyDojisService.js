const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes } = require('../../../Constants.js');

class InLadyDojisService extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce the cost of events by 1',
            max: AbilityDsl.limit.perConflict(1),
            condition: context => context.game.isDuringConflict(),
            effect: 'reduce the cost of events this conflict',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceCost({
                    amount: 1,
                    match: card => card.type === CardTypes.Event
                })
            }))
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.isParticipating())) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

InLadyDojisService.id = 'in-lady-doji-s-service';

module.exports = InLadyDojisService;


