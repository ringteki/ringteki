import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Decks, PlayTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import { PlayCharacterAsIfFromHandAtHome } from '../../../PlayCharacterAsIfFromHand';
import { PlayDisguisedCharacterAsIfFromHandAtHome } from '../../../PlayDisguisedCharacterAsIfFromHand';

export default class AgashaTaiko extends DrawCard {
    static id = 'agasha-taiko';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            effect: 'search their dynasty deck for a character',
            gameAction: AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a character to put into play ',
                deck: Decks.DynastyDeck,
                cardCondition: (card) => card.type === CardTypes.Character && card.printedCost <= 2 && !card.isUnique(),
                gameAction: AbilityDsl.actions.playCard((context) => {
                    const target = context.targets[0];
                    return {
                        target,
                        source: this,
                        resetOnCancel: false,
                        playType: PlayTypes.PlayFromHand,
                        playAction: target
                            ? [
                                  new PlayCharacterAsIfFromHandAtHome(target),
                                  new PlayDisguisedCharacterAsIfFromHandAtHome(target)
                              ]
                            : undefined,
                        ignoredRequirements: ['phase']
                    };
                })
            })
        });
    }
}
