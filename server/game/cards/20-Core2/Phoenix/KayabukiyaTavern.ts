import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';

export default class KayabukiyaTavern extends ProvinceCard {
    static id = 'kayabukiya-tavern';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    (event.conflict.getConflictProvinces() as ProvinceCard[]).some((p) => p === context.source)
            },
            gameAction: AbilityDsl.actions.resolveConflictRing()
        });
    }
}
