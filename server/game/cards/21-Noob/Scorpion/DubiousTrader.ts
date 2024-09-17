import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DubiousTrader extends DrawCard {
    static id = 'dubious-trader';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.canContributeGloryWhileBowed()
        });

        this.action({
            title: 'Make a deal',
            evenDuringDynasty: true,
            cost: AbilityDsl.costs.bowSelf(),
            gameAction: AbilityDsl.actions.gainFate()
        });
    }
}
