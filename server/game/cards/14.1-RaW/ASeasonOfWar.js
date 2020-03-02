const DrawCard = require('../../drawcard.js');
const DynastyPhase = require('../../gamesteps/dynastyphase.js');
const { Locations, Durations, Phases } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ASeasonOfWar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard all cards from provinces,  refill faceup, and start a new dynasty phase',
            effect: 'discard all cards in all provinces, and refill each province faceup',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardCard(context => ({
                    target: context.player.getDynastyCardsInProvince(Locations.Provinces).concat(context.player.opponent ?
                        context.player.opponent.getDynastyCardsInProvince(Locations.Provinces) : [])
                })),
                AbilityDsl.actions.refillFaceup(context => ({
                    target: context.player,
                    location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]
                })),
                AbilityDsl.actions.refillFaceup(context => ({
                    target: context.player.opponent,
                    location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]
                }))
            ]),
            then: ({
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.playerLastingEffect({
                        duration: Durations.UntilEndOfRound,
                        effect: AbilityDsl.effects.playerDelayedEffect({
                            when: {
                                onPhaseEnded: event => event.phase === Phases.Dynasty
                            },
                            message: '{0} has started a new dynasty phase!',
                            messageArgs: context => [context.source],
                            gameAction: AbilityDsl.actions.handler({
                                handler: context => context.game.queueStep(new DynastyPhase(context.game, false))
                            })
                        })
                    }),
                    AbilityDsl.actions.handler({
                        handler: context => {
                            this.game.addMessage('The dynasty phase is ended due to the effects of {0}', context.source);
                            if(context.game.currentPhaseObject) {
                                context.game.currentPhaseObject.endPhase();
                            }
                        }
                    })
                ])
            })
        });
    }
}

ASeasonOfWar.id = 'a-season-of-war';

module.exports = ASeasonOfWar;
