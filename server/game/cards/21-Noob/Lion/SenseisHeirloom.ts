import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class SenseisHeirloom extends DrawCard {
    static id = 'sensei-s-heirloom';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'bushi' });

        this.reaction({
            title: 'Search the top of your deck for an event',
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.deckSearch((context) => ({
                amount: (context.source.parent as DrawCard).getGlory(),
                cardCondition: (card) => card.type === CardTypes.Event,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            }))
        });
    }
}
