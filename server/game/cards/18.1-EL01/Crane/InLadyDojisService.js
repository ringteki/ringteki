const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Durations } = require('../../../Constants.js');

class InLadyDojisService extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Pacify a character',
            max: AbilityDsl.limit.perRound(1),
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: card => !card.isUnique()
            }),
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: [
                        AbilityDsl.effects.cardCannot('declareAsAttacker'),
                        AbilityDsl.effects.cardCannot('declareAsDefender')
                    ]
                })
            },
            effect: 'prevent {0} from being declared as an attacker or defender this round'
        });
    }

    canPlay(context, playType) {
        if(context.game.isDuringConflict()) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

InLadyDojisService.id = 'in-lady-doji-s-service';

module.exports = InLadyDojisService;


