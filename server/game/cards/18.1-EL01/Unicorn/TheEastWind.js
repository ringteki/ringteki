const StrongholdCard = require('../../../strongholdcard.js');
const { CardTypes, Locations, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');
const { GameModes } = require('../../../../GameModes.js');

class TheEastWind extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Resolve the ability on a province',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Any,
                cardCondition: (card, context) => this.isValidTarget(card, context),
                gameAction: AbilityDsl.actions.resolveAbility(context => ({
                    target: context.target,
                    ability: context.target.abilities.actions[0],
                    ignoredRequirements: ['province'],
                    choosingPlayerOverride: context.choosingPlayerOverride
                }))
            }
        });
    }

    isValidTarget(card, context) {
        const baseCase = !card.facedown && !card.isBroken && card.abilities.actions.length > 0;
        const _canTargetStronghold = this.canTargetStronghold(context);
        const isRow = card.location !== Locations.StrongholdProvince && card.controller === context.player;
        const isMyStronghold = card.location === Locations.StrongholdProvince && card.controller === context.player;

        return baseCase && (isRow || (_canTargetStronghold && isMyStronghold));
    }

    canTargetStronghold(context) {
        let brokenLocations = [];
        let baseLocations = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree];
        if(this.game.gameMode !== GameModes.Skirmish) {
            baseLocations.push(Locations.ProvinceFour);
        }
        baseLocations.forEach(p => {
            const province = context.player.getProvinceCardInProvince(p);
            if(province.isBroken) {
                brokenLocations.push(p);
            }
        });

        return brokenLocations.length >= 3;
    }
}

TheEastWind.id = 'the-east-wind';

module.exports = TheEastWind;
