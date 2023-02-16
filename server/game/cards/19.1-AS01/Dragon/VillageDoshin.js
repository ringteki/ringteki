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
                onCardLeavesPlay: (event, context) => {
                    let attachment = event.card.type === CardTypes.Attachment;
                    let youControl = event.card.controller === context.player;
                    let inPlay = event.card.location === Locations.PlayArea;
                    let byAbility = event.context.ability.isTriggeredAbility();
                    let fromOpponent = event.context.player === context.player.opponent;
                    return attachment && youControl && inPlay && byAbility && fromOpponent;
                }
            },

            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => {
                    let opponentHasEnoughCards = context.player.opponent.hand.size() >= DOSHIN_TAX;
                    let opponentIsAllowedToDiscardCards = AbilityDsl.actions
                        .discardAtRandom({ amount: 2 })
                        .canAffect(context.player.opponent, context);
                    return opponentHasEnoughCards && opponentIsAllowedToDiscardCards;
                },
                falseGameAction: AbilityDsl.actions.cancel({
                    replacementGameAction: AbilityDsl.actions.removeFromGame((context) => ({
                        target: context.source,
                        location: Locations.Any
                    }))
                }),
                trueGameAction: AbilityDsl.actions.chooseAction((context) => {
                    let payOption = 'Discard ' + DOSHIN_TAX + ' random cards from hand to continue';
                    let refuseOption = 'Do not discard, let the attachment stay in play';
                    return {
                        player: Players.Opponent,
                        activePromptTitle: 'Select one',
                        choices: {
                            [payOption]: AbilityDsl.actions.discardAtRandom({
                                amount: DOSHIN_TAX,
                                target: context.player.opponent
                            }),
                            [refuseOption]: AbilityDsl.actions.cancel({
                                replacementGameAction: AbilityDsl.actions.removeFromGame((context) => ({
                                    target: context.source,
                                    location: Locations.Any
                                }))
                            })
                        },
                        messages: {
                            [payOption]: '{0} pays off the Dōshin. The action continues as normal',
                            [refuseOption]: '{0} refuses to discard 2 cards. The attachment stays in play'
                        },
                        messageArgs: [context.player.opponent]
                    };
                })
            }),

            effect: 'protect {1}',
            effectArgs: (context) => context.event.card
        });
    }
}

VillageDoshin.id = 'village-doshin';

module.exports = VillageDoshin;
