import { Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class StrikeFromTheShadows extends DrawCard {
    static id = 'strike-from-the-shadows';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Give Shinobi +1/+1',
            when: {
                afterConflict: (event, context) => context.player.cardsInPlay.filter((card: DrawCard) => card.isParticipating() && card.hasTrait('shinobi')).length > 0
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.isParticipating() && card.hasTrait('shinobi')),
                effect: [
                    AbilityDsl.effects.modifyBothSkills(1),
                ],
                duration: Duration.UntilEndOfConflict
            })),
            effect: 'give all participating Shinobi they control +1{1}/+1{2} until the end of the conflict',
            effectArgs: ['military', 'political'],
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
