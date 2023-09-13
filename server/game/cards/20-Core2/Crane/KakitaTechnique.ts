import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

const kakitaTechniqueCost = function () {
    return {
        canPay: function () {
            return true;
        },
        resolve: function (context, result) {
            context.game.promptWithHandlerMenu(context.player.opponent, {
                activePromptTitle: 'Let opponent gain 2 honor to resolve Kakita Technique?',
                source: context.source,
                choices: ['Yes', 'No'],
                handlers: [
                    () => context.costs.kakitaTechniqueCostPaid = true,
                    () => context.costs.kakitaTechniqueCostPaid = false
                ]
            });
        },
        payEvent: function (context) {
            if(context.costs.kakitaTechniqueCostPaid) {
                let events = [];
                context.game.addMessage('{0} chooses to resolve Kakita Technique. {1} will gain 2 honor', context.player.opponent, context.player);
                return events;
            } else {
                context.game.addMessage('{0} chooses not to resolve Kakita Technique', context.player.opponent);
            }

            let action = context.game.actions.handler(); //this is a do-nothing event to allow you to opt out and not scuttle the event
            return action.getEvent(context.player, context);

        },
        promptsPlayer: true
    };
};

export default class KakitaTechnique extends DrawCard {
    static id = 'kakita-technique';

    setupCardAbilities() {
        this.action({
            title: 'Give character +2/+2',
            condition: context =>
                context.player.opponent &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player) <=
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyBothSkills(2),
                }))
            },
            effect: 'give {0} +2{1} and +2{2}',
            effectArgs: () => ['military', 'political'],
        });

        this.duelFocus({
            title: 'Add glory to duel result',
            cost: kakitaTechniqueCost(),
            gameAction: AbilityDsl.actions.multipleContext(context => {
                let gameActions = [
                    this.selectDuelTarget(Players.Self)    
                ];
                if (context.costs.kakitaTechniqueCostPaid) {
                    gameActions.push(this.selectDuelTarget(Players.Opponent)),
                    gameActions.push(AbilityDsl.actions.gainHonor(context => ({
                        target: context.player,
                        amount: 2
                    })))
                }

                return { gameActions }
            }),
            effect: 'focus, adding glory to their duel total'
        });
    }

    selectDuelTarget(controller) {
        return AbilityDsl.actions.selectCard((context) => {
            let duelTarget = undefined;
            return {
                activePromptTitle: 'Choose a duel participant',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Character,
                controller: controller,
                player: controller,
                cardCondition: card => context.event.duel.isInvolved(card),
                message: '{0} gives {1} {2} bonus skill for this duel',
                messageArgs: (card) => [controller === Players.Self ? context.player : context.player.opponent, card, card.glory],
                subActionProperties: (card) => {
                    duelTarget = card;
                    return { target: card }
                },
                gameAction: AbilityDsl.actions.cardLastingEffect(context => {
                    return {
                        effect: AbilityDsl.effects.modifyDuelSkill(((duelTarget && duelTarget.glory) || 0), context.event.duel),
                        duration: Durations.UntilEndOfDuel
                    }
                })
            }
        });
    }
}
