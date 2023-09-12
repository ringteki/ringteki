import { CardTypes } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';
import type DrawCard from '../../../drawcard';

export default class DinnerInTheSky extends ProvinceCard {
    static id = 'dinner-in-the-sky';

    public setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => card.isParticipating() && card.politicalSkill <= 2,
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
