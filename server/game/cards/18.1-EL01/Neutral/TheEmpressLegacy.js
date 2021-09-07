const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');

class TheEmpressLegacy extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.parent && context.source.parent.isFaction('crab') && !context.source.parent.bowed,
            effect: AbilityDsl.effects.changePlayerGloryModifier(1)
        });

        this.wouldInterrupt({
            title: 'Ready for Glory Count',
            when: {
                onGloryCount: () => true
            },
            gameAction: AbilityDsl.actions.ready(context => ({
                target: context.source.parent
            }))
        });
    }
}

TheEmpressLegacy.id = 'the-empress-legacy';

module.exports = TheEmpressLegacy;


