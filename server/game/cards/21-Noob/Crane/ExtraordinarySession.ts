import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ExtraordinarySession extends DrawCard {
    static id = 'extraordinary-session';

    setupCardAbilities() {
        this.action({
            title: 'Claim the Imperial favor',
            gameAction: AbilityDsl.actions.performGloryCount({
                gameAction: (winner) => winner && AbilityDsl.actions.claimImperialFavor({ target: winner })
            })
        });
    }
}
