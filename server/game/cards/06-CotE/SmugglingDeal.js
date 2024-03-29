const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players, Durations, TargetModes } = require('../../Constants');

class SmugglingDeal extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Increase an ability\'s limit',
            cost: AbilityDsl.costs.giveHonorToOpponent(),
            target: {
                activePromptTitle: 'Select an ability to increase limits on',
                mode: TargetModes.Ability,
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.targetAbility.card,
                    duration: Durations.UntilEndOfRound,
                    effect: AbilityDsl.effects.increaseLimitOnAbilities({
                        targetAbility: context.targetAbility
                    })
                }))
            },
            effect: 'increase the limit on {1}\'s \'{2}\' ability',
            effectArgs: context => [context.targetAbility.card, context.targetAbility.title]
        });
    }
}

SmugglingDeal.id = 'smuggling-deal';

module.exports = SmugglingDeal;
