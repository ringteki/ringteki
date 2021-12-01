const DrawCard = require('../../../drawcard.js');
const { Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class IkomaTsanuri2Reprint extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source)
            },
            effect: 'prevent {1} from triggering province abilities on the attacked province this conflict',
            effectArgs: context => [context.player.opponent],
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player.opponent,
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: 'triggerAbilities',
                    restricts: 'attackedProvinceNonForced'
                })
            }))
        });
    }
}

IkomaTsanuri2Reprint.id = 'ikoma-tsanuri-but-not';

module.exports = IkomaTsanuri2Reprint;
