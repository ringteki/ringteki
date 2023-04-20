import { Locations, Players, CardTypes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');
import Ring = require('../../../ring');

const CHOICE_MOVE = 'Move another of your characters home';
const CHOICE_STAY = 'Done';

export default class IllusionaryDecoy extends DrawCard {
    static id = 'illusionary-decoy';

    public setupCardAbilities() {
        this.reaction({
            title: 'Put into play',
            location: Locations.Hand,
            when: {
                onConflictStarted: (event, context) =>
                    context.player.anyCardsInPlay((card: BaseCard) => card.hasTrait('shugenja'))
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.putIntoConflict((context) => ({ target: context.source })),
                AbilityDsl.actions.chooseAction({
                    messages: {
                        [CHOICE_MOVE]: '', // Don't want messages here
                        [CHOICE_STAY]: '' // Don't want messages here
                    },
                    choices: {
                        [CHOICE_MOVE]: AbilityDsl.actions.selectCard((context) => ({
                            controller: Players.Self,
                            cardType: CardTypes.Character,
                            cardCondition: (card) => card.isParticipating(),
                            message: '{0} moves home {1} - they were an {2}!',
                            messageArgs: (card, player) => [player, card, context.source],
                            gameAction: AbilityDsl.actions.sendHome()
                        })),
                        [CHOICE_STAY]: AbilityDsl.actions.noAction()
                    }
                })
            ]),
            effect: 'put {0} into play in the conflict',
            max: AbilityDsl.limit.perConflict(1)
        });

        this.action({
            title: 'Return to hand',
            condition: (context) => {
                const claimedRings: Ring[] = context.source.controller.getClaimedRings();
                const matchShugenjaElementWithClaimedRing = (context.source.controller.cardsInPlay as BaseCard[]).some(
                    (card) =>
                        card.getType() === CardTypes.Character &&
                        card.hasTrait('shugenja') &&
                        claimedRings.some((ring) =>
                            ring.getElements().some((element: string) => card.hasTrait(element))
                        )
                );
                return matchShugenjaElementWithClaimedRing;
            },
            gameAction: AbilityDsl.actions.returnToHand()
        });
    }
}
