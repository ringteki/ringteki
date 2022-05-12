const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, Players } = require('../../../Constants');

class BayushisSaboteurs extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard or flip facedown dynasty cards',
            condition: context => context.source.isParticipating() && context.game.currentConflict.defendingPlayer,
            gameAction: this.spyAbility(),
            effect: 'discard or flip facedown all of {1}\'s dynasty cards',
            effectArgs: context => context.game.currentConflict.defendingPlayer
        });
    }

    spyAbility() {
        const discardActions = AbilityDsl.actions.sequential([
            AbilityDsl.actions.discardCard(context => ({
                target: context.game.currentConflict.defendingPlayer.getDynastyCardsInProvince(Locations.Provinces)
            })),
            AbilityDsl.actions.refillFaceup(context => ({
                target: context.game.currentConflict.defendingPlayer,
                location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]
            }))
        ]);

        const facedownActions = AbilityDsl.actions.turnFacedown(context => ({
            target: context.game.currentConflict.defendingPlayer.getDynastyCardsInProvince(Locations.Provinces)
        }));

        return AbilityDsl.actions.chooseAction(context =>({
            player: context.player !== context.game.currentConflict.defendingPlayer ? Players.Opponent : Players.Self,
            messages: {
                'Discard Dynasty Cards': '{0} chooses to discard their dynasty cards',
                'Flip Dynasty Cards Facedown': '{0} chooses to flip their dynasty cards facedown'
            },
            choices: {
                'Discard Dynasty Cards': discardActions,
                'Flip Dynasty Cards Facedown': facedownActions
            }
        }));
    }
}

BayushisSaboteurs.id = 'bayushi-s-saboteurs';

module.exports = BayushisSaboteurs;
