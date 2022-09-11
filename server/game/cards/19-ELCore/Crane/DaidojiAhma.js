const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Players, CardTypes, Locations, Durations, PlayTypes } = require('../../../Constants');

const ahmaCost = function (ahmaController) {
    return {
        canPay: function (context) {
            const canLoseFate = context.game.actions.loseFate().canAffect(context.player, context);
            const canGainFate = context.game.actions.gainFate().canAffect(ahmaController, context);
            return canLoseFate && canGainFate && context.player === context.source.controller && context.player !== ahmaController;
        },
        resolve: function () {
            return true;
        },
        payEvent: function (context) {
            let events = [];
            let honorAction = context.game.actions.takeFate({ target: context.player.opponent });
            events.push(honorAction.getEvent(context.player, context));
            context.game.addMessage('{0} gives {1} 1 fate to trigger {2}\'s ability', context.player, ahmaController, context.source);

            return events;
        },
        promptsPlayer: false
    };
};

class DaidojiAhma extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Increase the cost of a character or holding',
            when: {
                onPhaseStarted: event => event.phase !== 'setup'
            },
            target: {
                cardType: [CardTypes.Character, CardTypes.Holding],
                location: Locations.Provinces,
                controller: Players.Any,
                cardCondition: card => card.isFaceup(),
                gameAction: AbilityDsl.actions.conditional(context => ({
                    condition: context => context.target.type === CardTypes.Character,
                    trueGameAction: AbilityDsl.actions.playerLastingEffect({
                        effect: AbilityDsl.effects.increaseCost({
                            amount: 1,
                            playingTypes: PlayTypes.PlayFromProvince,
                            match: card => card === context.target
                        }),
                        duration: Durations.UntilEndOfPhase,
                        targetController: Players.Opponent
                    }),
                    falseGameAction: AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.additionalTriggerCostForCard(() => [ahmaCost(this.controller)])
                    })
                }))
            },
            effect: '{1}{2}{3}{4}{5}',
            effectArgs: context => {
                if(context.target.type === CardTypes.Character) {
                    return ['increase the cost to play ', context.target, ' by 1 this phase', '', ''];
                }
                return ['force ', context.target.controller, ' to give them 1 fate as an additional cost to trigger ', context.target, ' this phase'];

            }
        });
    }
}

DaidojiAhma.id = 'daidoji-ahma';

module.exports = DaidojiAhma;
