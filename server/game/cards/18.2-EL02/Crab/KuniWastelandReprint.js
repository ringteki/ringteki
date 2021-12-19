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
            effect: 'prevent attacking characters from triggering abilities until the end of the conflict',
            gameAction: AbilityDsl.actions.conflictLastingEffect({
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.charactersCannot({
                    cannot: 'triggerAbilities',
                    restricts: 'attackingCharacters'
                })
            }),
        });
    }
}

KuniWastelandReprint.id = 'kuni-island';

module.exports = KuniWastelandReprint;
