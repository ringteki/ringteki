import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { ICanOnlyBeDeclaredAsAttackerWithCondition } from '../../../Effects/EffectValueMap.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class AttentiveGuardsman extends DrawCard {
    static id = 'attentive-guardsman';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.canOnlyBeDeclaredAsAttackerWithCondition((props: ICanOnlyBeDeclaredAsAttackerWithCondition) => {
                const { incomingAttackers } = props;
                // console.log("incomingAttackers", incomingAttackers?.map(a => a.name), incomingAttackers?.some((card: DrawCard) => (card.getType() === CardType.Character && card.isUnique())));
                return !!incomingAttackers?.some((card: DrawCard) => (card.getType() === CardType.Character && card.isUnique()))
            })
        });

        this.persistentEffect({
            condition: context => context.game.isDuringConflict() &&
                context.game.currentConflict?.attackingPlayer === context.player &&
                !context.game.currentConflict?.attackers.some(card => card.getType() === CardType.Character && card.isUnique()),
            effect: [
                AbilityDsl.effects.cardCannot('moveToConflict'),
            ]
        });

        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });
    }
}
