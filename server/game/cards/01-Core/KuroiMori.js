const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes } = require('../../Constants');

class KuroiMori extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch the conflict type or ring',
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Switch the contested ring': AbilityDsl.actions.selectRing({
                        activePromptTitle: 'Choose a ring to switch with the contested ring',
                        message: '{0} switches the contested ring with {1}',
                        ringCondition: ring => ring.isUnclaimed(),
                        messageArgs: (ring, player) => [player, ring],
                        gameAction: AbilityDsl.actions.switchConflictElement()
                    }),
                    'Switch the conflict type': AbilityDsl.actions.switchConflictType()
                }
            },
            effect: '{1}',
            effectArgs: context => context.select.toLowerCase()
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

KuroiMori.id = 'kuroi-mori';

module.exports = KuroiMori;
