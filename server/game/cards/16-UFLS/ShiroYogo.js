const StrongholdCard = require('../../strongholdcard.js');
const { Durations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ShiroYogo extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Prevent a character from triggering abilities',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isDishonored,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.cardCannot('triggerAbilities')
                })
            },
            effect: 'prevent {0} from triggering their abilities until the end of the phase'
        });
    }
}

ShiroYogo.id = 'shiro-yogo';

module.exports = ShiroYogo;


