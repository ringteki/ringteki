import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Durations, Locations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class MagicWall extends DrawCard {
    static id = 'magic-wall';

    setupCardAbilities() {
        this.action({
            title: 'Double province strength',
            condition: (context) => context.game.isDuringConflict(),
            effect: 'double the province strength of an attacked province',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: (card) => {
                    return (
                        card.isConflictProvince() &&
                        card.element.some((element: string) => {
                            if (element === 'all') {
                                return true;
                            }
                            return (
                                this.game.rings[element].isConsideredClaimed(context.player) ||
                                this.game.currentConflict.ring.getElements().includes(element)
                            );
                        })
                    );
                },
                message: '{0} doubles the province strength of {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(() => ({
                        targetLocation: Locations.Provinces,
                        effect: AbilityDsl.effects.modifyProvinceStrengthMultiplier(2)
                    })),
                    AbilityDsl.actions.onAffinity({
                        trait: 'earth',
                        gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                            duration: Durations.UntilEndOfConflict,
                            targetController: context.player,
                            effect: AbilityDsl.effects.playerCannot({
                                cannot: 'loseHonor',
                                restricts: 'unopposedHonorLoss'
                            })
                        })),
                        effect: 'prevent {1} from losing unopposed honor this conflict',
                        effectArgs: (context) => [context.player]
                    })
                ])
            }))
        });
    }
}
