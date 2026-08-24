import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import BaseCard from '../../../BaseCard.js';

export default class IuchiHatsue extends DrawCard {
    static id = 'iuchi-hatsue';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => {
                if (!context.game.currentConflict) {
                    return false;
                }
                return context.game.currentConflict.getNumberOfParticipantsFor(context.player, card => card.type === CardType.Character && card.hasTrait('creature')) > 0
            },
            effect: AbilityDsl.effects.modifyBothSkills(2)
        });

        this.action({
            title: 'Switch 2 characters you control',
            targets: {
                characterInConflict: {
                    activePromptTitle: 'Choose a participating character to send home',
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: card => card.isParticipating()
                },
                characterAtHome: {
                    dependsOn: 'characterInConflict',
                    activePromptTitle: 'Choose a character to move to the conflict',
                    cardType: CardType.Character,
                    controller: context => (context.targets.characterInConflict as BaseCard).controller === context.player ? Players.Self : Players.Opponent,
                    player: context => (context.targets.characterInConflict as BaseCard).controller === context.player ? Players.Self : Players.Opponent,
                    gameAction: AbilityDsl.actions.joint([
                        AbilityDsl.actions.sendHome(context => ({ target: context.targets.characterInConflict })),
                        AbilityDsl.actions.moveToConflict()
                    ])
                }
            },
            effect: 'switch {1} and {2}',
            effectArgs: context => [context.targets.characterInConflict, context.targets.characterAtHome]
        });
    }
}
