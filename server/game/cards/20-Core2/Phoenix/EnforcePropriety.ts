import type AbilityContext from '../../../AbilityContext';
import { CardTypes, Players } from '../../../Constants';
import type TriggeredAbilityContext from '../../../TriggeredAbilityContext';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type Player from '../../../player';

export default class EnforcePropriety extends DrawCard {
    static id = 'enforce-propriety';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.card.type === CardTypes.Event &&
                    context.player.opponent &&
                    this.#countReadyShugenja(context.player) > this.#countReadyShugenja(context.player.opponent)
            },

            gameAction: AbilityDsl.actions.conditional({
                condition: (context) =>
                    this.#hasFateToPay(context.player.opponent) && this.#canLoseFate(context, context.player.opponent),
                falseGameAction: AbilityDsl.actions.cancel(),
                trueGameAction: AbilityDsl.actions.chooseAction((context) => {
                    const payOption = 'Lose 1 fate';
                    const refuseOption = 'Let the effects be canceled';
                    return {
                        player: Players.Opponent,
                        activePromptTitle: 'Select one',
                        choices: {
                            [payOption]: AbilityDsl.actions.multiple([
                                AbilityDsl.actions.loseFate({ amount: 1, target: context.player.opponent }),
                                AbilityDsl.actions.draw({ amount: 1, target: context.player })
                            ]),
                            [refuseOption]: AbilityDsl.actions.cancel()
                        },
                        messages: {
                            [payOption]: '{0} loses 1 fate',
                            [refuseOption]: '{0} refuses to lose 1 fate. The effects of {2} are canceled'
                        },
                        messageArgs: [context.event.card]
                    };
                })
            }),
            effect: 'tax {1}',
            effectArgs: (context: TriggeredAbilityContext) => context.event.cardTargets
        });
    }

    #countReadyShugenja(player: Player): number {
        return player.cardsInPlay.reduce(
            (sum: number, card: DrawCard) => (!card.bowed && card.hasTrait('shugenja') ? sum + 1 : sum),
            0
        );
    }

    #hasFateToPay(player: Player) {
        return player.opponent.fate >= 1;
    }

    #canLoseFate(context: AbilityContext, player: Player) {
        return AbilityDsl.actions.loseFate({ amount: 1, target: player }).canAffect(player, context);
    }
}
