const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes, Players } = require('../../Constants');

class StewardOfCrypticLore extends DrawCard {
    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.modifyPoliticalSkill(3)
        });

        this.action({
            title: 'Changes the strength of the attacked province',
            condition: context => context.game.isDuringConflict('earth'),
            targets: {
                select: {
                    mode: TargetModes.Select,
                    player: Players.Self,
                    choices: {
                        'Province gets +3 strength': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.game.currentConflict.conflictProvince,
                            effect: AbilityDsl.effects.modifyProvinceStrength(3)
                        })),
                        'Province gets -3 strength': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.game.currentConflict.conflictProvince,
                            effect: AbilityDsl.effects.modifyProvinceStrength(-3)
                        }))
                    }
                }
            }
        });
    }
}

StewardOfCrypticLore.id = 'steward-of-cryptic-lore';

module.exports = StewardOfCrypticLore;

