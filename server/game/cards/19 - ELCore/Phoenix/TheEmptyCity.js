const ProvinceCard = require('../../../provincecard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { TargetModes } = require('../../../Constants');

class TheEmptyCity extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Claim a political ring',
            when: {
                onCardPlayed: (event, context) => event.originalLocation === context.source.location
            },
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: ring => !ring.isClaimed() && !ring.isRemovedFromGame(),
                gameAction: AbilityDsl.actions.claimRing({
                    takeFate: false
                })
            },
            effect: 'claim the {0}.'
        });
    }
}

TheEmptyCity.id = 'the-empty-city';

module.exports = TheEmptyCity;
