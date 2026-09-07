import DrawCard from '../../../DrawCard.js';
import { AbilityType, Players, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class RavingLunatic extends DrawCard {
    static id = 'raving-lunatic';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!(context.player.opponent && context.player.opponent.showBid % 2 === 1),
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Injure a character',
                condition: (context: AbilityContext<this>) => context.source.isParticipating(),
                target: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.injure(context => ({
                        target: [context.target, context.source]
                    }))
                }
            })
        });

        this.persistentEffect({
            condition: context => !!(context.player.opponent && context.player.opponent.showBid % 2 === 0),
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }
}
