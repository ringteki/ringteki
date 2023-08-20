import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TaciturnRider extends DrawCard {
    static id = 'taciturn-rider';

    setupCardAbilities() {
        this.action({
            title: 'Ready me',
            condition: context => context.source.isAttacking() && context.game.currentConflict.getParticipants(
                (card: DrawCard) => card.controller === context.player
            ).length > 0,
            gameAction: AbilityDsl.actions.ready()
        });
    }
}
