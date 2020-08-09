import { CardTypes, Players, TargetModes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');


class PrepareForWar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove honor token and any attachment',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.selectCard(context => ({
                            mode: TargetModes.Unlimited,
                            cardType: CardTypes.Attachment,
                            controller: Players.Any,
                            cardCondition: card => card.parent === context.target,
                            activePromptTitle: 'Choose any amount of attachments',
                            optional: true,
                            gameAction: AbilityDsl.actions.discardFromPlay(),
                            message: '{0} chooses to discard {1} from {2}',
                            messageArgs: cards => [context.player, cards.length === 0 ? 'no attachments' : cards, context.target]
                        })),
                        AbilityDsl.actions.menuPrompt(context => ({
                            activePromptTitle: 'Do you wish to discard the status token?',
                            choices: ['Yes', 'No'],
                            optional: true,
                            choiceHandler: (choice, displayMessage) => {
                                if(displayMessage && choice === 'Yes') {
                                    this.game.addMessage('{0} chooses to discard the status token from {1}', context.player, context.target);
                                }

                                return { target: (choice === 'Yes' ? context.target.personalHonor : []) };
                            },
                            player: Players.Self,
                            gameAction: AbilityDsl.actions.discardStatusToken()
                        }))
                    ]),
                    AbilityDsl.actions.honor(context => ({
                        target: context.target.hasTrait('commander') ? context.target : []
                    }))
                ])
            },
            effect: '{1}{2} {0}',
            effectArgs: context => {
                let isCommander = context.target.hasTrait('commander');
                let hasAttachments = context.target.attachments.size() > 0;
                let hasToken = context.target.isDishonored || context.target.isHonored;
                let discardMessage = '';
                if(hasAttachments) {
                    discardMessage += 'choose to discard any number of attachments';
                    if(hasToken) {
                        discardMessage += ' or the status token from';
                    } else {
                        discardMessage += ' from';
                    }
                } else if(hasToken) {
                    discardMessage += 'choose to discard the status token from';
                }
                let honorMessage = '';
                if(isCommander) {
                    honorMessage = 'honor';
                    if(discardMessage.length > 0) {
                        honorMessage += ' and ';
                    }
                }
                return [honorMessage, discardMessage];
            }
        });
    }
}

PrepareForWar.id = 'prepare-for-war';

module.exports = PrepareForWar;
