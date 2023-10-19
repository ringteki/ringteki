import { TargetModes, Players, Locations, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SuperiorPapermill extends DrawCard {
    static id = 'superior-papermill';

    setupCardAbilities() {
        this.action({
            title: 'Flip up to 2 dynasty cards',
            phase: Phases.Dynasty,
            target: {
                mode: TargetModes.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards',
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.flipDynasty()
            }
        });
    }
}