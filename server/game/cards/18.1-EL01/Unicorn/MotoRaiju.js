const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Locations, TargetModes } = require('../../../Constants');

class MotoRaiju extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Get a skill bonus',
            condition: context => context.source.isParticipating(),
            targets: {
                select: {
                    mode: TargetModes.Select,
                    choices: {
                        'Military Bonus': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.source,
                            effect: AbilityDsl.effects.modifyMilitarySkill(context.player.getNumberOfOpponentsFaceupProvinces(province => province.location !== Locations.StrongholdProvince))
                        })),
                        'Political Bonus': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.source,
                            effect: AbilityDsl.effects.modifyPoliticalSkill(context.player.getNumberOfOpponentsFaceupProvinces(province => province.location !== Locations.StrongholdProvince))
                        }))
                    }
                }
            },
            effect: 'give itself +{1}{2} until the end of the conflict',
            effectArgs: context => [
                context.player.getNumberOfOpponentsFaceupProvinces(province => province.location !== Locations.StrongholdProvince),
                context.selects.select.choice === 'Military Bonus' ? 'military' : 'political'
            ]
        });
    }
}

MotoRaiju.id = 'moto-raiju';
module.exports = MotoRaiju;
