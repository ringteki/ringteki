const StrongholdCard = require('../../strongholdcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ShiroKitsuki extends StrongholdCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Name a card',
            when: {
                onConflictDeclared: () => true
            },
            cost: AbilityDsl.costs.nameCard(),
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            gameAction: AbilityDsl.actions.playerLastingEffect(playerLastingEffectContext => ({
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.delayedEffect({
                    when: {
                        onCardPlayed: (event, context) => {
                            return event.player === context.player.opponent &&
                                event.card.name === playerLastingEffectContext.costs.nameCardCost;
                        }
                    },
                    multipleTrigger: true,
                    gameAction: AbilityDsl.actions.selectRing(context => ({
                        activePromptTitle: 'Choose a ring to claim',
                        ringCondition: ring => ring.isUnclaimed(),
                        message: '{0} claims the {1}',
                        messageArgs: ring => [context.player, ring],
                        gameAction: AbilityDsl.actions.claimRing({ takeFate: true, type: 'political'})
                    }))
                })
            })),
            effect: 'claim a ring whenever {1} plays a card named {2}',
            effectArgs: context => [context.player.opponent, context.costs.nameCardCost]
        });
    }
}

ShiroKitsuki.id = 'shiro-kitsuki';

module.exports = ShiroKitsuki;

