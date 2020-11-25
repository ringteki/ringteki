const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants');

class StewardOfCrypticLore extends DrawCard {
    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.modifyPoliticalSkill(3)
        });

        this.action({
            title: 'Changes the strength of the attacked province',
            effect: 'change the province strength of {1}',
            effectArgs: context => context.game.currentConflict.conflictProvince,
            condition: context => context.game.isDuringConflict('earth'),
            gameAction: AbilityDsl.actions.chooseAction(() => ({
                target: this.game.currentConflict.conflictProvince,
                messages: {
                    'Raise attacked province\'s strength by 3': '{0} chooses to increase {1}\'s strength by 3',
                    'Lower attacked province\'s strength by 3': '{0} chooses to reduce {1}\'s strength by 3'
                },
                choices: {
                    'Raise attacked province\'s strength by 3': AbilityDsl.actions.cardLastingEffect(() => ({
                        targetLocation: Locations.Provinces,
                        effect: AbilityDsl.effects.modifyProvinceStrength(3)
                    })),
                    'Lower attacked province\'s strength by 3': AbilityDsl.actions.cardLastingEffect(() => ({
                        targetLocation: Locations.Provinces,
                        effect: AbilityDsl.effects.modifyProvinceStrength(-3)
                    }))
                }
            }))
        });
    }
}

StewardOfCrypticLore.id = 'steward-of-cryptic-lore';

module.exports = StewardOfCrypticLore;

