import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Location } from '../../../Constants.js';
import BaseCard from '../../../BaseCard.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class PurveyorOfRarities extends DrawCard {
    static id = 'purveyor-of-rarities';

    setupCardAbilities() {
        this.conflictAction({
            title: 'Discard a card for bonuses',
            cost: AbilityDsl.costs.discardCard({ location: Location.Hand }),
            gameAction: AbilityDsl.actions.conditional((context: any) => ({
                condition: () => this.#cardCondition(context),
                trueGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({
                        target: context.source,
                        effect: AbilityDsl.effects.modifyBothSkills(1)
                    }),
                    AbilityDsl.actions.gainFate({
                        target: context.player
                    })
                ]),
                falseGameAction: AbilityDsl.actions.cardLastingEffect({
                    target: context.source,
                    effect: AbilityDsl.effects.modifyBothSkills(3)
                }),
            })),
            effect: 'give +{1}{2}/+{1}{3} to {4}{5}',
            effectArgs: context => this.#cardCondition(context) ?
                [1, 'military', 'political', context.source, ' and gain 1 fate'] :
                [3, 'military', 'political', context.source, '']
        });
    }

    #cardCondition(context: AbilityContext) {
        if (!context.costs.discardCard) {
            return false;
        }
        const card = (context.costs.discardCard as BaseCard[])[0];
        return card.hasSomeTrait('gaijin', 'foreign') || this.#isOutOfClan(card)
    }

    #isOutOfClan(card: BaseCard): boolean {
        return !card.isFaction('neutral') && !card.isFaction('unicorn');
    }
}
