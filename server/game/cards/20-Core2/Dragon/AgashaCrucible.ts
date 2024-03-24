import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AgashaCrucible extends DrawCard {
    static id = 'agasha-crucible';

    public setupCardAbilities() {
        this.action({
            title: 'Give Elemental Trait to a Fire Shugenja',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasEveryTrait('fire', 'shugenja'),
                gameAction: AbilityDsl.actions.chooseAction({
                    activePromptTitle: 'Choose Trait to gain',
                    options: Object.fromEntries(
                        ['Air', 'Earth', 'Void', 'Water'].map((option) => [
                            option,
                            {
                                message: `{1} gains the ${option} Trait`,
                                action: AbilityDsl.actions.sequential([
                                    AbilityDsl.actions.cardLastingEffect({
                                        duration: Durations.UntilEndOfPhase,
                                        effect: AbilityDsl.effects.addTrait(option.toLowerCase())
                                    }),
                                    AbilityDsl.actions.playerLastingEffect((context) => ({
                                        targetController: context.player,
                                        duration: Durations.UntilPassPriority,
                                        effect: AbilityDsl.effects.additionalAction(1)
                                    }))
                                ])
                            }
                        ])
                    )
                })
            },
            effect: 'give {0} another Elemental Trait, and take another action!'
        });
    }
}
