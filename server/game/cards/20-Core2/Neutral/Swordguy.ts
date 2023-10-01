import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class Swordguy extends DrawCard {
    static id = 'swordguy';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: context => 
                context.game.currentDuel &&
                context.game.currentDuel.participants.includes(context.source),
            effect: [
                AbilityDsl.effects.ignoreDuelSkill(),
                AbilityDsl.effects.winDuelTies()
            ]
        });
    }
}
