const ProvinceCard = require('../../../provincecard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Durations } = require('../../../Constants');

class AshenFlamePlateau extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent opponent from triggering character abilities',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            effect: 'prevent {1} from triggering character abilities this conflict',
            effectArgs: context => [context.player.opponent],
            gameAction: AbilityDsl.actions.conflictLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                effect: [AbilityDsl.effects.charactersCannot({
                    cannot: 'triggerAbilities',
                    restricts: 'opponentsCharacters',
                    applyingPlayer: context.player
                }),
                AbilityDsl.effects.charactersCannot({
                    cannot: 'initiateKeywords',
                    restricts: 'opponentsCharacters',
                    applyingPlayer: context.player
                })
                ]
            }))
        });
    }
}

AshenFlamePlateau.id = 'ashen-flame-plateau';

module.exports = AshenFlamePlateau;
