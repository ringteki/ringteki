import { Locations, CardTypes, Players } from '../../../Constants';
import TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

const DOSHIN_TAX = 2;

export default class VillageDoshin extends DrawCard {
    static id = 'village-doshin';

    public setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Protect attachment from leaving play',
            location: Locations.Hand,
            cost: AbilityDsl.costs.discardSelf(),
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.cardTargets.some((card: BaseCard) => {
                        const attachment = card.type === CardTypes.Attachment;
                        const onCharacterYouControl =
                            card.parent &&
                            card.parent.type === CardTypes.Character &&
                            card.parent.controller === context.player;
                        const inPlay = card.location === Locations.PlayArea;
                        return attachment && onCharacterYouControl && inPlay;
                    })
            },

            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => {
                    const opponentHasEnoughCards = context.player.opponent.hand.size() >= DOSHIN_TAX;
                    const opponentIsAllowedToDiscardCards = AbilityDsl.actions
                        .discardAtRandom({ amount: 2 })
                        .canAffect(context.player.opponent, context);
                    return opponentHasEnoughCards && opponentIsAllowedToDiscardCards;
                },
                falseGameAction: AbilityDsl.actions.cancel(),
                trueGameAction: AbilityDsl.actions.chooseAction((context) => {
                    const payOption = 'Discard ' + DOSHIN_TAX + ' random cards from hand';
                    const refuseOption = 'Let the effect be canceled';
                    return {
                        player: Players.Opponent,
                        activePromptTitle: 'Select one',
                        choices: {
                            [payOption]: AbilityDsl.actions.discardAtRandom({
                                amount: DOSHIN_TAX,
                                target: context.player.opponent
                            }),
                            [refuseOption]: AbilityDsl.actions.cancel()
                        },
                        messages: {
                            [payOption]: '{0} distracts the Dōshin.',
                            [refuseOption]:
                                '{0} refuses to discard ' + DOSHIN_TAX + ' cards. The effects of {2} are canceled.'
                        },
                        messageArgs: [context.event.card]
                    };
                })
            }),

            effect: 'protect {1}',
            effectArgs: (context: TriggeredAbilityContext) => context.event.cardTargets
        });
    }
}
