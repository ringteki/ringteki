const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Locations } = require('../../../Constants');

class LayOfTheLand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reveal a province and discard status tokens',
            target: {
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardTypes.Province,
                controller: Players.Any,
                location: Locations.Provinces,
                cardCondition: card => !card.isBroken,
                gameAction: AbilityDsl.actions.multipleContext(context => {
                    const promptActions = this.getStatusTokenPrompts(context);
                    return ({
                        gameActions: [
                            AbilityDsl.actions.reveal(context => ({ target: context.target })),
                            ...promptActions
                        ]
                    });
                })
            },
            effect: 'reveal and disard any number of status tokens from {1}',
            effectArgs: context => [context.target.facedown ? context.target.location : context.target]
        });
    }

    canPlay(context, playType) {
        if(this.game.isDuringConflict()) {
            return false;
        }

        return super.canPlay(context, playType);
    }

    getStatusTokenPrompts(context) {
        const tokens = context.target.statusTokens;
        let prompts = [];
        tokens.forEach(token => {
            prompts.push(
                AbilityDsl.actions.menuPrompt(context => ({
                    activePromptTitle: `Do you wish to discard ${token.name}?`,
                    choices: ['Yes', 'No'],
                    optional: true,
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage && choice === 'Yes') {
                            this.game.addMessage('{0} chooses to discard {1} from {2}', context.player, token, context.target);
                        }

                        return { target: (choice === 'Yes' ? token : []) };
                    },
                    player: Players.Self,
                    gameAction: AbilityDsl.actions.discardStatusToken()
                }))
            );
        });

        return prompts;
    }
}

LayOfTheLand.id = 'lay-of-the-land';
module.exports = LayOfTheLand;
