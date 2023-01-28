const DrawCard = require('../../../drawcard.js');
const { CardTypes, DuelTypes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class MasterOfTheBlade extends DrawCard {
    setupCardAbilities() {
        const sacCondition = (card, context) => card.allowGameAction('sacrifice', context) && !card.bowed && card.hasTrait('weapon');

        this.action({
            condition: (context) =>
                context.source.isParticipating() && !context.source.bowed,
            limit: AbilityDsl.limit.perRound(2),
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent === context.source && card.hasTrait('weapon')
            }),
            title: 'Initiate a military duel',
            initiateDuel: context => ({
                type: DuelTypes.Military,
                message: '{0} {1}',
                messageArgs: duel => (duel.winner === context.source && context.source.attachments.filter(card => sacCondition(card, context)).length > 0) ?
                    ['bow or discard', duel.loser] : ['bow', duel.loser],
                gameAction: duel => {
                    const wonDuel = duel.winner === context.source;
                    const canSacWeapon = context.source.attachments.filter(card => sacCondition(card, context)).length > 0;
                    if(!wonDuel || !canSacWeapon) {
                        return AbilityDsl.actions.bow({ target: duel.loser });
                    }

                    return AbilityDsl.actions.chooseAction({
                        messages: {
                            'Sacrifice a weapon to discard loser': '{0} chooses to sacrifice a weapon to discard {2}',
                            'Bow loser': '{0} chooses to bow {2}'
                        },
                        messageArgs: [duel.loser],
                        choices: {
                            'Sacrifice a weapon to discard loser': AbilityDsl.actions.multiple([
                                AbilityDsl.actions.selectCard(context => ({
                                    controller: Players.Self,
                                    cardCondition: card => card.parent && card.parent === context.source && sacCondition(card, context),
                                    message: '{0} sacrifices {1}',
                                    messageArgs: card => [context.player, card],
                                    gameAction: AbilityDsl.actions.sacrifice()
                                })),
                                AbilityDsl.actions.discardFromPlay({ target: duel.loser })
                            ]),
                            'Bow loser': AbilityDsl.actions.multiple([
                                AbilityDsl.actions.bow({ target: duel.loser }),
                                AbilityDsl.actions.handler({
                                    handler: () => true
                                })
                            ])
                        }
                    });
                }
            })
        });
    }
}

MasterOfTheBlade.id = 'master-of-the-blade';

module.exports = MasterOfTheBlade;
