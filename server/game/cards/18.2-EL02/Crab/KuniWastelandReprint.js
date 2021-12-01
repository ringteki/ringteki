const ProvinceCard = require('../../../provincecard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Durations } = require('../../../Constants');

class KuniWastelandReprint extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Blank a character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            effect: 'blank {0} until the end of the conflict',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.type === CardTypes.Character && card.isAttacking(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.blank(),
                    duration: Durations.UntilEndOfConflict
                }))
            }
        });
    }
}

KuniWastelandReprint.id = 'kuni-island';

module.exports = KuniWastelandReprint;
