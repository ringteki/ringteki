import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';

export default class FumarolesYellowstone extends ProvinceCard {
    static id = 'fumaroles-yellowstone';

    setupCardAbilities() {
        this.reaction({
            title: 'Switch the conflict type',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            effect: 'switch the conflict type',
            gameAction: AbilityDsl.actions.switchConflictType()
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
