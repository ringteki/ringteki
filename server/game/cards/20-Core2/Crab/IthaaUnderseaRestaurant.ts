import { CardTypes, Players } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class IthaaUnderseaRestaurant extends ProvinceCard {
    static id = 'ithaa-undersea-restaurant';

    public setupCardAbilities() {
        this.action({
            title: 'Increase province strength',
            target: {
                cardType: CardTypes.Character,
                player: Players.Self,
                cardCondition: (card: DrawCard) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    effect: AbilityDsl.effects.modifyProvinceStrength((context.target as DrawCard).militarySkill)
                }))
            }
        });
    }
}
