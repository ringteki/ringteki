import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DrawingTheVoid extends DrawCard {
    static id = 'drawing-the-void';

    setupCardAbilities() {
        this.action({
            title: 'Move fate to a character',
            condition: (context) => context.player.isTraitInPlay('shugenja'),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'void',
                    promptTitleForConfirmingAffinity: 'Bow that character?',
                    noAffinityGameAction: AbilityDsl.actions.placeFate((context) => ({
                        amount: 1,
                        origin: context.source.controller
                    })),
                    gameAction: AbilityDsl.actions.chooseAction((context) => ({
                        options: {
                            'Add fate from my pool': {
                                action: AbilityDsl.actions.placeFate({
                                    amount: 1,
                                    origin: context.source.controller
                                })
                            },
                            'Add fate from a ring': {
                                action: AbilityDsl.actions.selectRing((context) => ({
                                    activePromptTitle: 'Choose a ring to take a fate from',
                                    message: '{0} moves a fate from the {1} to {2}',
                                    ringCondition: (ring) => ring.fate >= 1,
                                    messageArgs: (ring) => [context.player, ring, context.target],
                                    subActionProperties: (ring) => ({ origin: ring }),
                                    gameAction: AbilityDsl.actions.placeFate({ target: context.target })
                                }))
                            }
                        }
                    }))
                })
            }
        });
    }
}
