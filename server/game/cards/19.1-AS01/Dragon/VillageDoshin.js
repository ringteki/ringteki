const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

const DOSHIN_TAX = 2;

class VillageDoshin extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Protect attachment from leaving play',
            location: Locations.Hand,
            cost: AbilityDsl.costs.discardSelf(),
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.cardTargets.some((card) => {
                        let attachment = card.type === CardTypes.Attachment;
                        let onCharacterYouControl =
                            card.parent &&
                            card.parent.type === CardTypes.Character &&
                            card.parent.controller === context.player;
                        let inPlay = card.location === Locations.PlayArea;
                        return attachment && onCharacterYouControl && inPlay;
                    })
            },

            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => {
                    let opponentHasEnoughCards = context.player.opponent.hand.size() >= DOSHIN_TAX;
                    let opponentIsAllowedToDiscardCards = AbilityDsl.actions
                        .discardAtRandom({ amount: 2 })
                        .canAffect(context.player.opponent, context);
                    return opponentHasEnoughCards && opponentIsAllowedToDiscardCards;
                },
                falseGameAction: AbilityDsl.actions.cancel(),
                trueGameAction: AbilityDsl.actions.chooseAction((context) => {
                    let payOption = 'Discard ' + DOSHIN_TAX + ' random cards from hand';
                    let refuseOption = 'Let the effect be canceled';
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
            effectArgs: (context) => context.event.cardTargets
        });
    }
}

VillageDoshin.id = 'village-doshin';

module.exports = VillageDoshin;
