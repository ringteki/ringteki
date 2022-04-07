const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { TargetModes, Locations, Players } = require('../../../Constants');

class BayushiSaboteur extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard or flip facedown a player\'s dynasty cards',
            condition: context => context.source.isParticipating(),
            target: {
                mode: TargetModes.Select,
                targets: true,
                activePromptTitle: 'Choose a player',
                choices:  {
                    [this.owner.name]: this.spyAbility(this.owner),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: this.spyAbility(this.owner.opponent)
                }
            },
            effect: 'discard or flip facedown all of {1}\'s dynasty cards',
            effectArgs: context => context.select === this.owner.name ? this.owner : this.owner.opponent
        });
    }

    spyAbility(player) {
        const discardActions = AbilityDsl.actions.sequential([
            AbilityDsl.actions.discardCard(() => ({
                target: player.getDynastyCardsInProvince(Locations.Provinces)
            })),
            AbilityDsl.actions.refillFaceup(() => ({
                target: player,
                location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]
            }))
        ]);

        const facedownActions = AbilityDsl.actions.turnFacedown(() => ({
            target: player.getDynastyCardsInProvince(Locations.Provinces)
        }));

        return AbilityDsl.actions.chooseAction({
            player: this.controller !== player ? Players.Opponent : Players.Self,
            messages: {
                'Discard Dynasty Cards': '{0} chooses to discard their dynasty cards',
                'Flip Dynasty Cards Facedown': '{0} chooses to flip their dynasty cards facedown'
            },
            choices: {
                'Discard Dynasty Cards': discardActions,
                'Flip Dynasty Cards Facedown': facedownActions
            }
        });
    }
}

BayushiSaboteur.id = 'bayushi-saboteur';

module.exports = BayushiSaboteur;
