import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class StrikeOfFlowingWater extends DrawCard {
    static id = 'strike-of-flowing-water';

    setupCardAbilities() {
        // TODO: As written this should apply to the duel itself, not to a participating character
        // but I don't want to implement duel effects yet
        this.duelFocus({
            title: 'Add to your duel',
            cost: AbilityDsl.costs.payHonor(1),
            duelCondition: (duel, context) => context.player.honorBid !== context.player.opponent.honorBid,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => {
                    const isInvolved = context.event.duel.isInvolved(card);
                    return isInvolved;
                },
                gameAction: AbilityDsl.actions.cardLastingEffect(context => {
                    const value = Math.abs(context.player.honorBid - context.player.opponent.honorBid);
                    return {
                        effect: AbilityDsl.effects.modifyDuelSkill(value, context.event.duel),
                        duration: Durations.UntilEndOfDuel
                    };
                })
            },
            effect: 'grant {1} bonus skill for duel resolution to {0}',
            effectArgs: context => [Math.abs(context.player.honorBid - context.player.opponent.honorBid)]
        });

        this.action({
            title: 'Blank printed text for conflict',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && context.game.currentConflict.getCharacters(context.player).some(myCard =>
                    myCard.hasTrait('duelist')),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.blank(),
                    duration: Durations.UntilEndOfConflict
                }))
            },
            effect: 'treat {1} as if its printed text box were blank until the end of the conflict',
            effectArgs: (context) => context.target
        });
    }
}
