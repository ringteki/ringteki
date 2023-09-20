import { CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KamakrazeeWarBoy extends DrawCard {
    static id = 'kamakrazee-war-boy';

    public setupCardAbilities() {
        this.interrupt({
            title: 'Remove fate from a character',
            when: {
                onCardLeavesPlay: ({ card }, context) =>
                    card === context.source && card.location === Locations.PlayArea && card.isParticipating()
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.getMilitarySkill() <= context.source.getMilitarySkill(),
                gameAction: AbilityDsl.actions.removeFate()
            }
        });
    }
}
