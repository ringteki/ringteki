import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { Conflict } from '../../../conflict';
import { CardTypes } from '../../../Constants';

export default class AwakeTheFearfulHeart extends DrawCard {
    static id = 'awake-the-fearful-heart';

    setupCardAbilities() {
        this.action({
            title: 'Move home each character without fate',
            condition: (context) =>
                context.player.anyCardsInPlay((card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja')),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.sendHome((context) => ({
                    target: (context.game.currentConflict as Conflict | null)
                        ?.getCharacters(context.player.opponent)
                        .filter((character) => character.fate === 0)
                })),
                AbilityDsl.actions.onAffinity({
                    trait: 'air',
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.game.findAnyCardsInPlay((card) => card.getType() === CardTypes.Character),
                        effect: AbilityDsl.effects.cardCannot('moveToConflict')
                    }))
                })
            ])
        });
    }
}
