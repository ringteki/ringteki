const ProvinceCard = require('../../../provincecard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Durations } = require('../../../Constants');

class KuniWastelandReprint extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent opponent from triggering character abilities',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            effect: 'prevent {1} from triggering character abilities this conflict',
            effectArgs: context => [context.player.opponent],
            gameAction: AbilityDsl.actions.conflictLastingEffect({
                duration: Durations.UntilEndOfConflict,
                effect: [AbilityDsl.effects.charactersCannot({
                    cannot: 'triggerAbilities',
                    restricts: 'opponentsCharacters'
                }),
                AbilityDsl.effects.charactersCannot({
                    cannot: 'initiateKeywords',
                    restricts: 'opponentsCharacters'
                })
                ]
            })
        });
    }
}

KuniWastelandReprint.id = 'kuni-island';

module.exports = KuniWastelandReprint;
