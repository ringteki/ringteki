const DrawCard = require('../../../drawcard');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Players, Locations, Phases, TokenTypes } = require('../../../Constants');

class TheOnisFist extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  context => context.source.location === Locations.StrongholdProvince,
                message: '{0} is discarded from play as it is in a Stronghold Province',
                messageArgs: context => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay(context => ({
                    target: context.source
                }))
            })
        });

        this.forcedReaction({
            title: 'Place an honor token',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            gameAction: AbilityDsl.actions.addToken(),
        });

        this.interrupt({
            title: 'Break a province',
            when : {
                onPhaseEnded: (event, context) => event.phase === Phases.Conflict &&
                    !context.player.getProvinceCardInProvince(context.source.location).isBroken &&
                    context.source.getTokenCount(TokenTypes.Honor) > 0
            },
            cost: AbilityDsl.costs.removeSelfFromGame(),
            target: {
                cardType: CardTypes.Province,
                player: Players.Opponent,
                controller: Players.Opponent,
                location: Locations.Provinces,
                cardCondition: card => !card.facedown && card.location !== Locations.StrongholdProvince,
                gameAction: AbilityDsl.actions.break()
            }
        })
    }
}

TheOnisFist.id = 'generic-holding';

module.exports = TheOnisFist;
