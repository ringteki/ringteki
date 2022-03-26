const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class MatsuSakura extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onInitiateAbilityEffects: (event, context) => context.source.isAttacking() && event.card.isConflictProvince()
            },
            effect: 'cancel the effects of {1}\'s ability',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

MatsuSakura.id = 'matsu-sakura';

module.exports = MatsuSakura;
