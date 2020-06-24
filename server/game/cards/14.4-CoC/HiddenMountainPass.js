const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class HiddenMountainPass extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Flip this holding\'s province facedown',
            when: {
                onPhaseEnded: event => event.phase === Phases.Conflict
            },
            gameAction: AbilityDsl.actions.turnFacedown(context => ({
                target: context.player.getProvinceCardInProvince(context.source.location)
            })),
            effect: 'Turn {1} facedown',
            effectArgs: context => context.player.getProvinceCardInProvince(context.source.location)
        });
    }
}

HiddenMountainPass.id = 'hidden-mountain-pass';

module.exports = HiddenMountainPass;
