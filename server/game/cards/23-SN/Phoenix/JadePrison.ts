import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players } from '../../../Constants.js';

export default class JadePrison extends DrawCard {
    static id = 'jade-prison';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            condition: (context) => context.player.hasAffinity('earth'),
            effect: AbilityDsl.effects.reduceCost({ amount: 1, match: (card, source) => card === source })
        });

        this.reaction({
            title: 'Bow a character that just readied',
            when: {
                onCardReadied: (event, context) =>
                    context.player.isCharacterTraitInPlay('shugenja') &&
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent &&
                    (event.card.hasSomeTrait('corrupt', 'shadowlands') || event.card.isTainted)
            },
            gameAction: AbilityDsl.actions.bow((context) => ({ target: context.event.card }))
        });
    }
}
