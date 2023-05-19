import { CardTypes, Durations, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import StrongholdCard from '../../../strongholdcard';

export default class CraneBox extends StrongholdCard {
    static id = 'crane-box';

    setupCardAbilities() {
        this.action({
            title: 'Bow this stronghold',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.modifyGlory(2)
                })
            },
            effect: 'give +2 glory to {0} for this phase'
        });
    }
}
