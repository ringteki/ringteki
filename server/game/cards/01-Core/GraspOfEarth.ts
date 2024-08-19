import { Locations, Players, PlayTypes } from '../../Constants';
import AbilityDsl = require('../../abilitydsl');
import DrawCard = require('../../drawcard');

export default class GraspOfEarth extends DrawCard {
    static id = 'grasp-of-earth';

    public setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            condition: (context) => context.player.hasAffinity('earth'),
            effect: AbilityDsl.effects.reduceCost({ amount: 1, match: (card, source) => card === source })
        });

        this.action({
            title: "Opponent's cards cannot join this conflict",
            condition: (context) => this.game.isDuringConflict() && context.player.opponent !== undefined,
            cost: AbilityDsl.costs.bowSelf(),
            effect: 'prevent the opponent from bringing characters to the conflict',
            gameAction: [
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.player.opponent.cardsInPlay.toArray(),
                    effect: AbilityDsl.effects.cardCannot('moveToConflict')
                })),
                AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player.opponent,
                    effect: AbilityDsl.effects.playerCannot({
                        cannot: PlayTypes.PlayFromHand,
                        restricts: 'characters'
                    })
                }))
            ]
        });
    }
}
