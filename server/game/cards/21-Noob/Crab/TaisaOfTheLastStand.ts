import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Durations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class TaisaOfTheLastStand extends DrawCard {
    static id = 'taisa-of-the-last-stand';

    setupCardAbilities() {
        this.action({
            title: 'Give +1/+1 to all your characters',
            condition: (context) => context.source.isParticipating(),
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter(() => true),
                effect: [AbilityDsl.effects.modifyBothSkills(1)],
                duration: Durations.UntilEndOfConflict
            })),
            effect: 'give all characters they control +1{1} and and +1{2}',
            effectArgs: ['military', 'political'],
            limit: AbilityDsl.limit.perRound(2)
        });
    }
}