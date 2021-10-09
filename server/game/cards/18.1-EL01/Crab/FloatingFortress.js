const DrawCard = require('../../../drawcard.js');
const { Locations, Players, CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class FloatingFortress extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Rebuild a holding',
            condition: context => context.player.isDefendingPlayer(),
            cost: AbilityDsl.costs.payFate(1),
            max: AbilityDsl.limit.perRound(3),
            target: {
                cardType: CardTypes.Holding,
                controller: Players.Self,
                location: Locations.DynastyDiscardPile,
                cardCondition: card => card.isFaction('crab') && card.name !== 'Floating Fortress',
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    cardCondition: card => card.isConflictProvince(),
                    controller: Players.Self,
                    subActionProperties: card => {
                        context.targets.destination = card;
                        return ({ destination: card.location });
                    },
                    message: '{0} places {1} in {2}',
                    messageArgs: () => [context.player, context.target, context.targets.destination],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.moveCard({
                            target: context.target,
                            faceup: true
                        }),
                        AbilityDsl.actions.cardLastingEffect({
                            target: context.target,
                            duration: Durations.UntilEndOfPhase,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onConflictFinished: () => true
                                },
                                message: '{0} is discarded due to {1}\'s effect',
                                messageArgs: [context.target, context.source],
                                gameAction: AbilityDsl.actions.discardCard()
                            })
                        })
                    ])
                }))
            },
            effect: 'put {0} into a province'
        });
    }
}

FloatingFortress.id = 'floating-fortress';

module.exports = FloatingFortress;
