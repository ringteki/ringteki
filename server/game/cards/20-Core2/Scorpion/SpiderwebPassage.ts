import AbilityContext from '../../../AbilityContext';
import { CardTypes, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SpiderwebPassage extends DrawCard {
    static id = 'spiderweb-passage';

    setupCardAbilities() {
        this.action({
            title: 'Discard a participating character with 0 skill',
            condition: (context) => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrificeSelf(),
            targets: {
                character: {
                    mode: TargetModes.Single,
                    cardType: CardTypes.Character,
                    cardCondition: (card: DrawCard) =>
                        card.isParticipating() &&
                        ((card.militarySkill === 0 && !isNaN(parseInt(card.cardData.military))) ||
                            (card.politicalSkill === 0 && !isNaN(parseInt(card.cardData.political))))
                },
                select: {
                    activePromptTitle: `Choose one`,
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: (context) => context.targets.character.controller,
                    choices: (context) => ({
                        [`Discard ${this.getNumberOfParticipatingShinobi(context)} cards`]:
                            AbilityDsl.actions.chosenDiscard((context) => ({
                                amount: this.getNumberOfParticipatingShinobi(context),
                                target: context.targets.character.controller
                            })),
                        [`Discard ${context.target.name}`]: AbilityDsl.actions.discardFromPlay((context) => ({
                            target: context.targets.character
                        }))
                    })
                }
            }
        });
    }

    getNumberOfParticipatingShinobi(context: AbilityContext): number {
        return context.game.currentConflict.getParticipants(
            (card) => card.controller === context.player.opponent && card.hasTrait('shinobi')
        ).length;
    }
}
