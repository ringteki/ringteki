import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { ProvinceCard } from '../../../ProvinceCard';

export default class LayOfTheLand extends DrawCard {
    static id = 'lay-of-the-land';

    setupCardAbilities() {
        this.action({
            title: 'Reveal a province and discard status tokens',
            target: {
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardTypes.Province,
                controller: Players.Any,
                location: Locations.Provinces,
                cardCondition: (card) => !card.isBroken,
                gameAction: AbilityDsl.actions.multipleContext((context) => {
                    const promptActions = this.getStatusTokenPrompts(context.target as ProvinceCard);
                    return {
                        gameActions: [
                            AbilityDsl.actions.reveal((context) => ({ target: context.target })),
                            ...promptActions
                        ]
                    };
                })
            },
            effect: 'reveal and disard any number of status tokens from {1}',
            effectArgs: (context) => [context.target.facedown ? context.target.location : context.target]
        });
    }

    getStatusTokenPrompts(target: ProvinceCard) {
        return target.statusTokens.map((token) =>
            AbilityDsl.actions.menuPrompt((context) => ({
                activePromptTitle: `Do you wish to discard ${token.name}?`,
                choices: ['Yes', 'No'],
                optional: true,
                choiceHandler: (choice, displayMessage) => {
                    if (displayMessage && choice === 'Yes') {
                        this.game.addMessage(
                            '{0} chooses to discard {1} from {2}',
                            context.player,
                            token,
                            context.target
                        );
                    }

                    return { target: choice === 'Yes' ? token : [] };
                },
                player: Players.Self,
                gameAction: AbilityDsl.actions.discardStatusToken()
            }))
        );
    }
}
