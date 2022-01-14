const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class IkomaTsanuri2Reprint extends DrawCard {
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

IkomaTsanuri2Reprint.id = 'ikoma-tsanuri-but-not';

module.exports = IkomaTsanuri2Reprint;
