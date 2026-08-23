import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';

export default class EmissaryOfTheFiveRivers extends DrawCard {
    static id = 'emissary-of-the-five-rivers';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a spirit',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('spirit'),
                gameAction: AbilityDsl.actions.honor()
            }
        });

        this.action({
            title: 'Ready a spirit',
            cost: AbilityDsl.costs.discardCard(),
            target: {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('spirit'),
                gameAction: AbilityDsl.actions.ready()
            },
        })
    }
}
