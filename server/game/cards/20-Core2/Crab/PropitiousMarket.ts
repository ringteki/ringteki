import type AbilityContext from '../../../AbilityContext';
import { Phases, TargetModes, TokenTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class PropitiousMarket extends DrawCard {
    static id = 'propitious-market';

    setupCardAbilities() {
        this.action({
            title: 'Place an honor token',
            phase: Phases.Conflict,
            gameAction: AbilityDsl.actions.addToken(),
            then: (context) => ({
                target: {
                    mode: TargetModes.Select,
                    activePromptTitle: 'Sacrifice ' + context.source.name + '?',
                    choices: {
                        Yes: AbilityDsl.actions.sacrifice({ target: context.source }),
                        No: () => true
                    }
                },
                message: '{0} chooses {3}to sacrifice {1}',
                messageArgs: (context: AbilityContext) => (context.select === 'No' ? 'not ' : ''),
                then: (subThenContext: AbilityContext) => ({
                    gameAction: AbilityDsl.actions.gainFate({ amount: this.#amountOfFateGain(subThenContext.source) }),
                    message: '{0} uses {1} to gain {3} fate',
                    messageArgs: [this.#amountOfFateGain(subThenContext.source)]
                })
            })
        });
    }

    #amountOfFateGain(holding: DrawCard) {
        return Math.min(3, holding.getTokenCount(TokenTypes.Honor));
    }
}
