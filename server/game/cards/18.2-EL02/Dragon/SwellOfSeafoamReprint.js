const DrawCard = require('../../../drawcard.js');
import { CardTypes, Players } from '../../../Constants.js';
const AbilityDsl = require('../../../abilitydsl.js');
const EventRegistrar = require('../../../eventregistrar');

class SwellOfSeafoamReprint extends DrawCard {
    setupCardAbilities() {
        this.kihoPlayedThisConflict = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'onCardPlayed']);

        this.action({
            title: 'Prevent bowing after conflict',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.multipleContext(context => {
                    const promptActions = this.getStatusTokenPrompts(context);
                    let actions = ({
                        gameActions: [
                            AbilityDsl.actions.cardLastingEffect(({
                                effect: AbilityDsl.effects.doesNotBow()
                            }))
                        ]
                    });
                    if (this.isKihoPlayed(context)) {
                        actions.gameActions = [...actions.gameActions, ...promptActions]
                    }
                    return actions;
                }),
            },
            effect: '{1}prevent {0} from bowing at the end of the conflict',
            effectArgs: (context) => [this.isKihoPlayed(context) ? 'discard any number of status tokens from and ' : '']
        });
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

    //in case there's a "You are considered to have played a kiho" effect printed at some point, you can put that in here
    isKihoPlayed(context) { // eslint-disable-line no-unused-vars
        return this.kihoPlayedThisConflict;
    }

    onConflictFinished() {
        this.kihoPlayedThisConflict = false;
    }

    onCardPlayed(event) {
        if(event && event.context.player === this.controller && event.context.source.hasTrait('kiho')) {
            this.kihoPlayedThisConflict = true;
        }
    }
}

SwellOfSeafoamReprint.id = 'see-the-foam-be-the-foam';

module.exports = SwellOfSeafoamReprint;
