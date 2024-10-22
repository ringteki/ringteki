import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';

export default class VirtuesOfCommand extends DrawCard {
    static id = 'virtues-of-command';

    setupCardAbilities() {
        this.action({
            title: 'Give a skill bonus to your characters',
            condition: (context) =>
                context.source.parent?.isParticipating() &&
                !context.player.anyCardsInPlay((card: BaseCard) => card.isParticipating() && card.isDishonored),
            gameAction: AbilityDsl.actions.multipleContext((context) => {
                const characters = (context.game.currentConflict as Conflict).getCharacters(context.player);
                return {
                    gameActions: [
                        AbilityDsl.actions.cardLastingEffect({
                            target: characters.filter((char) => char.hasTrait('bushi')),
                            effect: AbilityDsl.effects.modifyPoliticalSkill(1)
                        }),
                        AbilityDsl.actions.cardLastingEffect({
                            target: characters.filter((char) => char.hasTrait('courtier')),
                            effect: AbilityDsl.effects.modifyMilitarySkill(1)
                        })
                    ]
                };
            })
        });
    }
}
