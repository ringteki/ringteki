import type AbilityContext from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { CardTypes, EventNames, Locations, Players, PlayTypes } from '../../../Constants';
import type { Cost } from '../../../Costs';
import DrawCard from '../../../drawcard';
import { EventRegistrar } from '../../../EventRegistrar';
import TriggeredAbilityContext from '../../../TriggeredAbilityContext';

type HifumiCost = Cost & { refreshHifumiCount: () => void };

function hifumiCost(): HifumiCost {
    let timesTriggered = 0;
    return {
        refreshHifumiCount: () => {
            timesTriggered = 0;
        },
        canPay: (context: AbilityContext): boolean => {
            return true;

            // This part works, but it should not be deployed before the payment itself is working
            //
            // if (timesTriggered === 0) {
            //     return true;
            // }

            // const fateAvailableForRemoval = (context.player.cardsInPlay as DrawCard[]).reduce(
            //     (total, card) =>
            //         card.type === CardTypes.Character && card.location === Locations.PlayArea && card.getFate() > 0
            //             ? total + 1
            //             : total,
            //     0
            // );
            // return fateAvailableForRemoval >= timesTriggered;
        },
        resolve: () => {
            timesTriggered += 1;
        },
        pay: (context: TriggeredAbilityContext): void => {
            // Kinda like Maho
        }
    };
}

export default class IsawaHifumi extends DrawCard {
    static id = 'isawa-hifumi';

    hifumiCost: HifumiCost;

    setupCardAbilities() {
        this.hifumiCost = hifumiCost();
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnRoundEnded, EventNames.OnCardLeavesPlay]);

        this.action({
            title: 'Play an event from discard',
            cost: this.hifumiCost,
            cannotTargetFirst: true,
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an event',
                cardType: CardTypes.Event,
                controller: Players.Self,
                location: Locations.ConflictDiscardPile,
                gameAction: AbilityDsl.actions.playCard({
                    resetOnCancel: true,
                    source: this,
                    playType: PlayTypes.PlayFromHand,
                    postHandler: (eventContext) => {
                        const card = eventContext.source;
                        context.game.addMessage("{0} is removed from the game by {1}'s ability", card, context.source);
                        context.player.moveCard(card, Locations.RemovedFromGame);
                    }
                })
            })),
            effect: 'play an event from their discard pile',
            limit: AbilityDsl.limit.unlimited()
        });
    }

    public onRoundEnded() {
        this.hifumiCost.refreshHifumiCount();
    }

    public onCardLeavesPlay(event: any) {
        if (event.card === this) {
            this.hifumiCost.refreshHifumiCount();
        }
    }
}