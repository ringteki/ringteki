const DrawCard = require('../../../drawcard.js');
const { Locations, CardTypes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

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
                    let fromOpponent =
                        event.context.player === context.player.opponent;
                    return (
                        attachment &&
                        youControl &&
                        inPlay &&
                        byAbility &&
                        fromOpponent
                    );
                }
            },

            gameAction: AbilityDsl.actions.conditional({
                condition: (context) => {
                    let opponentHasEnoughFate =
                        context.player.opponent.fate >= this.doshinTax(context);
                    let opponentIsAllowedToPayFate = AbilityDsl.actions
                        .loseFate()
                        .canAffect(context.player.opponent, context);
                    return opponentHasEnoughFate && opponentIsAllowedToPayFate;
                },
                falseGameAction: AbilityDsl.actions.cancel({
                    replacementGameAction: AbilityDsl.actions.removeFromGame(
                        (context) => ({
                            target: context.source,
                            location: Locations.Any
                        })
                    )
                }),
                trueGameAction: AbilityDsl.actions.chooseAction((context) => {
                    let doshinTax = this.doshinTax(context);
                    let payOption = 'Pay ' + doshinTax + ' fate to continue';
                    let refuseOption = 'Do not pay, let the attachment stay';
                    return {
                        player: Players.Opponent,
                        activePromptTitle: 'Select one',
                        choices: {
                            [payOption]: AbilityDsl.actions.loseFate({
                                amount: doshinTax,
                                target: context.player.opponent
                            }),
                            [refuseOption]: AbilityDsl.actions.cancel({
                                replacementGameAction:
                                    AbilityDsl.actions.removeFromGame(
                                        (context) => ({
                                            target: context.source,
                                            location: Locations.Any
                                        })
                                    )
                            })
                        },
                        messages: {
                            [payOption]:
                                '{0} pays off the Dōshin. The action continues as normal',
                            [refuseOption]:
                                '{0} refuses to pay. The attachment stays in play'
                        },
                        messageArgs: [context.player.opponent]
                    };
                })
            }),

            effect: 'protect {1}',
            effectArgs: (context) => context.event.card
        });
    }

    doshinTax(context) {
        let attachmentCost = context.event.card.getCost();
        return Math.max(1, attachmentCost);
    }
}

VillageDoshin.id = 'village-doshin';

module.exports = VillageDoshin;
