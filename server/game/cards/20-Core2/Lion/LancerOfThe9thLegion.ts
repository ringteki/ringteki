import { CardTypes, ConflictTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class LancerOfThe9thLegion extends DrawCard {
    static id = 'lancer-of-the-9th-legion';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: (context) =>
                context.game.isDuringConflict(ConflictTypes.Military) && context.source.isAttacking(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard, context) =>
                    card.isParticipating() && card.getMilitarySkill() <= context.source.getMilitarySkill(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
