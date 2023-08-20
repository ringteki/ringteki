import { TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class WebisusBlessing extends DrawCard {
    static id = 'webisu-s-blessing';

    setupCardAbilities() {
        this.action({
            title: 'Choose up to to status tokens to discard',
            target: {
                mode: TargetModes.UpTo,
                numCards: 2,
                cardCondition: card => card.hasStatusTokens,
                gameAction: AbilityDsl.actions.multipleContext((context) => {
                    return {
                        gameActions: this.getStatusTokenPrompts(context.target)
                    };
                })
            }
        })
    }

    getStatusTokenPrompts(targets) {
        let actions = [];
        targets.forEach((target) => {
            actions.push(
                AbilityDsl.actions.selectToken(() => ({
                    card: target,
                    activePromptTitle: `Which token do you wish to discard from ${target.name}?`,
                    message: '{0} discards {1} from {2}',
                    messageArgs: (token, player) => [player, token, target],
                    gameAction: AbilityDsl.actions.discardStatusToken()
                }))
            );
        });

        return actions;
    }
}
