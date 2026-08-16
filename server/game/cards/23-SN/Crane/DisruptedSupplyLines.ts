import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import { CardType, EventName, Players } from '../../../Constants.js';
import { Result } from '../../../costs/Cost.js';
import DrawCard from '../../../DrawCard.js';
import { EventPayload } from '../../../Events/EventPayloads.js';
import { MsgArg } from '../../../GameChat.js';
import Player from '../../../Player.js';
import { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

const resourcesAvailable = (context: TriggeredAbilityContext) => {
    let fateAvailable = false;
    if (context.game.actions.loseFate().canAffect(context.player, context)) {
        fateAvailable = true;
    }

    const eligibleCharacters = context.player.cardsInPlay.filter(
        (card: DrawCard) => card.getType() === CardType.Character &&
            context.game.actions.dishonor().canAffect(card, context)
    );
    const freeCharacters = eligibleCharacters.filter((card: DrawCard) => card.hasSomeTrait('scout', 'shinobi'));

    return { fateAvailable, eligibleCharacters, freeCharacters };
};

const disruptedSupplyLinesCost = function () {
    return {
        getCostMessage(context: TriggeredAbilityContext) {
            return ['dishonoring {1}{2}',
                [context.costs.disruptedSupplyLinesCostDishonoredCharacter,
                context.costs.disruptedSupplyLinesCostFatePaid ? ' and paying 1 fate' : ''] as MsgArg
            ];
        },
        getActionName(_context: TriggeredAbilityContext) {
            return 'disruptedSupplyLinesCost';
        },
        canPay: function (context: TriggeredAbilityContext) {
            const { fateAvailable, eligibleCharacters, freeCharacters } = resourcesAvailable(context);
            return freeCharacters.length > 0 || (fateAvailable && eligibleCharacters.length > 0);
        },
        resolve: function (context: TriggeredAbilityContext, results: Result) {
            const { fateAvailable, eligibleCharacters, freeCharacters } = resourcesAvailable(context);
            context.costs.disruptedSupplyLinesCostFatePaid = false;
            context.costs.disruptedSupplyLinesCostDishonoredCharacter = undefined;

            let cards = freeCharacters;
            if (fateAvailable) {
                cards = eligibleCharacters;
            }

            return context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a character to dishonor',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => cards.includes(card as DrawCard),
                context: context,
                onSelect: (player: Player, card: BaseCard) => {
                    context.costs.disruptedSupplyLinesCostFatePaid = !freeCharacters.includes(card as DrawCard);
                    context.costs.disruptedSupplyLinesCostDishonoredCharacter = card;
                    return true;
                },
                onCancel: () => {
                    results.cancelled = true;
                    return true;
                }
            });
        },
        payEvent: function (context: TriggeredAbilityContext) {
            const events = [];
            if (context.costs.disruptedSupplyLinesCostFatePaid) {
                const loseFateaction = context.game.actions.loseFate({ amount: 1 });
                events.push(loseFateaction.getEvent(context.player, context));
            }

            const dishonorAction = context.game.actions.dishonor({ target: context.costs.disruptedSupplyLinesCostDishonoredCharacter as BaseCard });
            events.push(dishonorAction.getEvent(context.player, context));

            return events;
        },
        promptsPlayer: true
    };
};

export default class DisruptedSupplyLines extends DrawCard {
    static id = 'disrupted-supply-lines';

    setupCardAbilities() {
        this.interrupt({
            title: 'Ready attached character',
            cost: disruptedSupplyLinesCost(),
            when: {
                onCardAttached: (event: EventPayload<EventName.OnCardAttached>, context) => (
                    context.source.parent && (context.source.parent as DrawCard).getType() === CardType.Character &&
                    event.context?.player === context.player.opponent
                )
            },
            gameAction: AbilityDsl.actions.chooseAction(context => ({
                options: {
                    'Give opponent 1 fate': {
                        action: AbilityDsl.actions.honor(),
                        message: '{0} chooses to give 1 fate to {2}',
                        messageArgs: [context.player]
                    },
                    'Remove attachment from the game': {
                        action: AbilityDsl.actions.removeFromGame({ target: context.event.card }),
                        message: '{0} chooses to remove {2} from the game',
                        messageArgs: [context.event.card]
                    }
                },
                player: Players.Opponent,
            })),
            effect: 'make {1} either give them 1 fate or remove {2} from the game',
            effectArgs: context => [context.player.opponent, context.event.card]
        });
    }
}
