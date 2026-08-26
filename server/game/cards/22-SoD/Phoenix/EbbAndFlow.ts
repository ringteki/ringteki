import { CardType, Duration, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class EbbAndFlow extends DrawCard {
    static id = 'ebb-and-flow';

    public setupCardAbilities() {
        this.action({
            title: 'Switch a character\'s skills',
            targets: {
                mine: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating() && card.hasTrait('shugenja'),
                    gameAction: AbilityDsl.actions.noAction()
                },
                opponents: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating() && !card.hasDash(),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.switchBaseSkills()
                    })
                }
            },
            effect: 'switch {1}\'s military and political skill',
            effectArgs: context => [context.targets.opponents],
            then: context => {
                const ctx = context;
                return {
                    thenCondition: () => ctx.player.fate > 0 && ctx.game.actions.loseFate().canAffect(ctx.player, ctx),
                    gameAction: AbilityDsl.actions.onAffinity({
                        trait: 'water',
                        promptTitleForConfirmingAffinity: 'Pay 1 fate to swap abilities?',
                        effect: 'swap the abilities of {0} and {1}',
                        effectArgs: () => [ctx.targets.mine, ctx.targets.opponents],
                        gameAction: AbilityDsl.actions.joint([
                            AbilityDsl.actions.loseFate({
                                target: ctx.player,
                                amount: 1
                            }),
                            AbilityDsl.actions.cardLastingEffect({
                                target: ctx.targets.mine,
                                effect: [
                                    AbilityDsl.effects.blank(),
                                    AbilityDsl.effects.gainAllAbilities(ctx.targets.opponents as DrawCard, true)
                                ],
                                duration: Duration.UntilEndOfConflict
                            }),
                            AbilityDsl.actions.cardLastingEffect({
                                target: ctx.targets.opponents,
                                effect: [
                                    AbilityDsl.effects.blank(),
                                    AbilityDsl.effects.gainAllAbilities(ctx.targets.mine as DrawCard, true)
                                ],
                                duration: Duration.UntilEndOfConflict
                            })
                        ])
                    })
                };
            }
        });
    }
}
