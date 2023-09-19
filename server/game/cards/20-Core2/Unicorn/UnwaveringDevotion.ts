import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class UnwaveringDevotion extends DrawCard {
    static id = 'unwavering-devotion';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card === context.source && !card.isDishonored,
            effect: AbilityDsl.effects.modifyGlory(1)
        });

        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsCharacterAbilitiesWithLowerGlory'
            })
        });
    }
}
