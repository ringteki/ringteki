const DrawCard = require('../../../drawcard.js');
const { TargetModes, CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

const shinjoArcherCost = function () {
    return {
        canPay: function (context) {
            const canMoveHome = context.game.actions.sendHome().canAffect(context.source, context);
            const canMoveToConflict = context.game.actions.moveToConflict().canAffect(context.source, context);

            return canMoveHome || canMoveToConflict;
        },
        getActionName(context) { // eslint-disable-line no-unused-vars
            return 'shinjoArcherCost';
        },
        getCostMessage: (context) => {
            if(!context.source.isParticipating()) {
                return ['moving {1} home', [context.source]];
            }
            return ['moving {1} to the conflict', [context.source]];
        },
        resolve: function (context, result) { // eslint-disable-line no-unused-vars
            context.costs.shinjoArcherCost = context.source;
        },
        payEvent: function (context) {
            let action = context.game.actions.moveToConflict({ target: context.costs.shinjoArcherCost });
            if(context.source.isParticipating()) {
                action = context.game.actions.sendHome({ target: context.costs.shinjoArcherCost });
            }
            return action.getEvent(context.costs.shinjoArcherCost, context);
        },
        promptsPlayer: false
    };
};

class ShinjoArcher extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move and give -2/-2',
            condition: context => context.game.isDuringConflict(),
            cost: shinjoArcherCost(),
            target: {
                mode: TargetModes.Single,
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyBothSkills(-2),
                    duration: Durations.UntilEndOfConflict
                }))
            },
            effect: 'give {0} -2{2}/-2{3}',
            effectArgs: context => [context.source, 'military', 'political']
        });
    }
}

ShinjoArcher.id = 'shinjo-archer';

module.exports = ShinjoArcher;
