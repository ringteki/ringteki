const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, CardTypes, TargetModes, Players } = require('../../Constants');

class StewardOfCrypticLore extends DrawCard {
    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.modifyPoliticalSkill(3)
        });

        this.action({
            title: 'Changes the strength of the attacked province',
            targets: {
                province:{
                    location: Locations.Provinces,
                    cardType: CardTypes.Province,
                    condition: context => context.game.isDuringConflict() && context.game.currentConflict.conflictProvince.location === context.source.location && context.game.rings['earth'].isContested()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'province',
                    player: Players.Self,
                    choices: {
                        'Province gets +3 strength': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.targets.province,
                            effect: AbilityDsl.effects.modifyProvinceStrength(3)
                        })),
                        'Province gets -3 strength': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.targets.province,
                            effect: AbilityDsl.effects.modifyProvinceStrength(-3)
                        }))
                    }
                }
            },
        });
    }
}

StewardOfCrypticLore.id = 'steward-of-cryptic-lore';

module.exports = StewardOfCrypticLore;

