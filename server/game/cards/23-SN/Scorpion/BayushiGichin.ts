import DrawCard from '../../../DrawCard.js';
import { CardType, DuelType, Players, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import { Duel } from '../../../Duel.js';
import { AbilityContext } from '../../../AbilityContext.js';
import Player from '../../../Player.js';

export default class BayushiGichin extends DrawCard {
    static id = 'bayushi-gichin';

    setupCardAbilities() {
        this.duelStrike({
            title: 'Poison a character',
            gameAction: AbilityDsl.actions.sequentialContext(context => ({
                gameActions: [
                    AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a duel participant',
                        cardType: CardType.Character,
                        controller: Players.Opponent,
                        cardCondition: (card) => {
                            if (!((context as TriggeredAbilityContext).event.duel as Duel).isInvolved(card)) {
                                return false;
                            }
                            const poisons = this.getPoisons(context);
                            return poisons.some(p => AbilityDsl.actions.attach().canAffect(card, context, { attachment: p }))
                        },
                        message: '{0} poisons {1}',
                        messageArgs: (cards) => {
                            return [context.player, cards]
                        },
                        subActionProperties: (card) => {
                            context.targets.character = card;
                            return { target: card };
                        },
                        gameAction: AbilityDsl.actions.noAction()
                    }),
                    AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a poison attachment',
                        cardType: CardType.Attachment,
                        controller: Players.Self,
                        location: [Location.Hand, Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                        cardCondition: (card) => card.hasTrait('poison') && AbilityDsl.actions.attach().canAffect(context.targets.character, context, { attachment: card }),
                        message: '{0} attaches {1}',
                        messageArgs: (cards) => {
                            return [context.player, cards]
                        },
                        subActionProperties: (card) => {
                            context.targets.attachment = card;
                            return { attachment: card };
                        },
                        gameAction: AbilityDsl.actions.noAction()
                    }),
                    AbilityDsl.actions.attach(() => {
                        return {
                            target: context.targets.character,
                            attachment: context.targets.attachment
                        }
                    })
                ]
            })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });

        this.conflictAction({
            title: 'Military duel to steal honor',
            initiateDuel: {
                type: DuelType.Military,
                gameAction: (duel, context) => {
                    if (duel.winner?.includes(context.source as DrawCard)) {
                        return AbilityDsl.actions.takeHonor({ target: duel.loserController })
                    }
                    return AbilityDsl.actions.noAction()
                }
            }
        });
    }

    getPoisons(context: AbilityContext) {
        const player = context.player as Player;
        const inDiscard = player.conflictDiscardPile.filter(card => card.hasTrait('poison'));
        const inHand = player.hand.filter(card => card.hasTrait('poison'));

        return [...inDiscard, ...inHand];
    }
}
