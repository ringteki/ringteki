import { CardTypes, Decks } from '../../../Constants';
import { PlayCharacterAsIfFromHandAtHome } from '../../../PlayCharacterAsIfFromHand';
import { PlayDisguisedCharacterAsIfFromHandAtHome } from '../../../PlayDisguisedCharacterAsIfFromHand';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class UtakuTakeko extends DrawCard {
    static id = 'utaku-takeko';

    public setupCardAbilities() {
        this.action({
            title: 'Play character from your discard pile',

            gameAction: AbilityDsl.actions.deckSearch(() => ({
                activePromptTitle: 'Select a character to play',
                amount: 8,
                deck: Decks.DynastyDeck,
                cardCondition: (card, context) =>
                    card.type === CardTypes.Character &&
                    card.glory >= 1 &&
                    card.isFaction('unicorn') &&
                    !card.isUnique() &&
                    AbilityDsl.actions.putIntoPlay().canAffect(card, context),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.target,
                        effect: [
                            AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHandAtHome),
                            AbilityDsl.effects.gainPlayAction(PlayDisguisedCharacterAsIfFromHandAtHome)
                        ]
                    })),
                    AbilityDsl.actions.playCard((context) => ({ target: context.target }))
                ]),
                shuffle: true
            })),
            effect: 'recall a {1} relative who is {2} {3}',
            effectArgs: (context) => [
                this.#msgDistance(context.target),
                this.#msgArticle(context.target),
                context.target
            ]
        });
    }

    #msgDistance(card: BaseCard): string {
        return card.hasTrait('gaijin') ? 'very distant' : 'distant';
    }

    #msgArticle(card: BaseCard): string {
        if (card.hasTrait('army')) {
            return 'in the';
        }

        switch (card.name[0]) {
            case 'A':
            case 'E':
            case 'I':
            case 'O':
            case 'U':
                return 'an';
            default:
                return 'a';
        }
    }
}
