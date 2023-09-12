import AbilityContext = require('../../../AbilityContext');
import { CardTypes, Phases, Players } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class ParanoidHososhi extends DrawCard {
    static id = 'paranoid-hososhi';

    public setupCardAbilities() {
        this.legendary(2);

        this.action({
            title: 'Steal fate from a character',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard, context) =>
                    card.getCost() === this.getHighestCostOfCharactersInPlay(context),
                gameAction: AbilityDsl.actions.removeFate((context) => ({
                    amount: 1,
                    recipient: context.player
                }))
            },
            effect: 'take 1 fate from {0} — evil begone!'
        });
    }

    private getHighestCostOfCharactersInPlay(context: AbilityContext) {
        return context.game
            .findAnyCardsInPlay((card: BaseCard) => card.type === CardTypes.Character)
            .reduce((prevHighestCost: number, card: DrawCard) => {
                const cost = card.getCost();
                return typeof cost === 'number' && cost > prevHighestCost ? cost : prevHighestCost;
            }, 0);
    }
}
