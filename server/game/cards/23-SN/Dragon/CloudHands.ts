import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class CloudHands extends DrawCard {
    static id = 'cloud-hands';

    setupCardAbilities() {
        this.action({
            title: 'Change base skill to match another character\'s',
            max: AbilityDsl.limit.perConflict(1),
            condition: context => context.game.isDuringConflict(),
            targets: {
                myCharacter: {
                    activePromptTitle: 'Choose a monk character',
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
                },
                oppCharacter: {
                    dependsOn: 'myCharacter',
                    activePromptTitle: 'Choose an opponent\'s character',
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.cardLastingEffect(context => {
                            let effects = [];
                            let oppCharacter = context.targets.oppCharacter;
                            if(oppCharacter.hasDash('military')) {
                                effects.push(AbilityDsl.effects.setBaseDash('military'));
                            } else {
                                effects.push(AbilityDsl.effects.setBaseMilitarySkill(oppCharacter.getBaseMilitarySkill()));
                            }
                            if(oppCharacter.hasDash('political')) {
                                effects.push(AbilityDsl.effects.setBaseDash('political'));
                            } else {
                                effects.push(AbilityDsl.effects.setBasePoliticalSkill(oppCharacter.getBasePoliticalSkill()));
                            }
                            return {
                                target: context.targets.myCharacter,
                                effect: effects
                            };
                        }),
                        AbilityDsl.actions.honor(context => ({
                            target: context.targets.myCharacter
                        }))
                    ])
                }
            },
            effect: 'honor {1} and set their base skills to equal {2}\'s base skills',
            effectArgs: context => [context.targets.myCharacter, context.targets.oppCharacter]
        });
    }
}
