import { Locations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class BayushisSaboteurs extends DrawCard {
    static id = 'bayushi-s-saboteurs';

    setupCardAbilities() {
        this.action({
            title: 'Discard or flip facedown dynasty cards',
            condition: (context) => context.source.isParticipating() && context.game.currentConflict.defendingPlayer,
            gameAction: AbilityDsl.actions.chooseAction((context) => ({
                player:
                    context.player !== context.game.currentConflict.defendingPlayer ? Players.Opponent : Players.Self,
                options: {
                    'Discard Dynasty Cards': {
                        action: AbilityDsl.actions.sequential([
                            AbilityDsl.actions.discardCard((context) => ({
                                target: context.game.currentConflict.defendingPlayer.getDynastyCardsInProvince(
                                    Locations.Provinces
                                )
                            })),
                            AbilityDsl.actions.refillFaceup((context) => ({
                                target: context.game.currentConflict.defendingPlayer,
                                location: [
                                    Locations.StrongholdProvince,
                                    Locations.ProvinceOne,
                                    Locations.ProvinceTwo,
                                    Locations.ProvinceThree,
                                    Locations.ProvinceFour
                                ]
                            }))
                        ]),
                        message: '{0} chooses to discard their dynasty cards'
                    },
                    'Flip Dynasty Cards Facedown': {
                        action: AbilityDsl.actions.turnFacedown((context) => ({
                            target: context.game.currentConflict.defendingPlayer.getDynastyCardsInProvince(
                                Locations.Provinces
                            )
                        })),
                        message: '{0} chooses to flip their dynasty cards facedown'
                    }
                }
            })),
            effect: "discard or flip facedown all of {1}'s dynasty cards",
            effectArgs: (context) => context.game.currentConflict.defendingPlayer
        });
    }
}
