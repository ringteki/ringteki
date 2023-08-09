import { CardTypes, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import StrongholdCard from '../../../strongholdcard';

export default class ScorpionBox extends StrongholdCard {
    static id = 'scorpion-box';

    setupCardAbilities() {
        this.action({
            title: 'Give a character -2/-2',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => !card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.modifyBothSkills(-2)
                })
            },
            effect: 'give {0} -2{1}/-2{2} for the phase',
            effectArgs: () => ['military', 'political']
        });
    }
}