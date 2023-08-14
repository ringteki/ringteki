import type AbilityContext from '../../../AbilityContext';
import { Locations, Players, TargetModes } from '../../../Constants';
import type { GameAction } from '../../../GameActions/GameAction';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type Player from '../../../player';

export default class ShibaShaHeiden extends DrawCard {
    static id = 'shiba-sha-heiden';

    setupCardAbilities() {
        this.reaction({
            title: 'Move this to stronghold province',
            when: {
                onCardRevealed: (event, context) =>
                    event.card === context.source &&
                    !(event.card.controller as Player)
                        .getDynastyCardsInProvince(Locations.StrongholdProvince)
                        .some((card: DrawCard) => card.isFaceup() && card.name === context.source.name)
            },
            effect: 'move it to their stronghold province',
            gameAction: AbilityDsl.actions.moveCard({ destination: Locations.StrongholdProvince })
        });

        this.action({
            title: 'Make offering to receive boon',
            target: {
                mode: TargetModes.Select,
                choices: (context) => {
                    const choices: [string, GameAction][] = [];
                    if (this.#canPayFate(context)) {
                        choices.push([
                            'Spend 1 fate',
                            this.#createEffect(
                                context.player,
                                AbilityDsl.actions.loseFate({ amount: 1, target: context.player })
                            )
                        ]);
                    }
                    if (this.#canDiscardCards(context)) {
                        choices.push([
                            'Discard 1 card',
                            this.#createEffect(
                                context.player,
                                AbilityDsl.actions.chosenDiscard({ amount: 1, target: context.player })
                            )
                        ]);
                    }
                    return Object.fromEntries(choices);
                }
            }
        });
    }

    #canPayFate(context: AbilityContext) {
        return (
            context.player.opponent.fate > 1 &&
            AbilityDsl.actions.loseFate({ amount: 1, target: context.player }).canAffect(context.player, context)
        );
    }

    #canDiscardCards(context: AbilityContext) {
        return (
            context.player.opponent.hand.size() >= 1 &&
            AbilityDsl.actions.chosenDiscard({ amount: 1, target: context.player }).canAffect(context.player, context)
        );
    }

    #createEffect(player: Player, cost: GameAction) {
        return AbilityDsl.actions.chooseAction({
            activePromptTitle: 'Choose your boon',
            player: Players.Self,
            options: {
                'Gain 1 fate': {
                    action: AbilityDsl.actions.sequential([
                        cost,
                        AbilityDsl.actions.gainFate({ amount: 1, target: player })
                    ]),
                    message: '{0} chooses to gain 1 fate'
                },
                'Draw 1 card': {
                    action: AbilityDsl.actions.sequential([
                        cost,
                        AbilityDsl.actions.draw({ amount: 1, target: player })
                    ]),
                    message: '{0} chooses to draw 1 card'
                }
            }
        });
    }
}
