import { CardTypes, ConflictTypes, Durations, EventNames, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ShosuroTechnique extends DrawCard {
    static id = 'shosuro-technique';

    setupCardAbilities() {
        this.reaction({
            title: 'Set skill for the duel',
            when: {
                onDuelInitiated: (event, context) => event.context.targets.some((x) => x.controller === context.player)
            },
            targets: {
                ally: {
                    activePromptTitle: 'Choose a character you control involved in the duel',
                    mode: TargetModes.Single,
                    controller: Players.Self,
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => context.event.targets.includes(card)
                },
                enemy: {
                    activePromptTitle: 'Choose a character your opponent controls involved in the duel',
                    mode: TargetModes.Single,
                    controller: Players.Opponent,
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => context.event.targets.includes(card)
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.targets.ally,
                    duration: Durations.UntilEndOfDuel,
                    effect: AbilityDsl.effects.setMilitarySkill(context.targets.enemy.militarySkill)
                })),
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.targets.ally,
                    duration: Durations.UntilEndOfDuel,
                    effect: AbilityDsl.effects.setPoliticalSkill(context.targets.enemy.politicalSkill)
                }))
            ])
        });

        this.action({
            title: "Set shinobi's skills to that of an enemy",
            condition: (context) => context.game.isDuringConflict(ConflictTypes.Military),
            targets: {
                shinobi: {
                    activePromptTitle: 'Choose a Shinobi you control',
                    mode: TargetModes.Single,
                    cardType: CardTypes.Character,
                    optional: false,
                    cardCondition: (card, context) =>
                        card.controller === context.player && card.hasTrait('shinobi') && card.isParticipating()
                },
                enemy: {
                    mode: TargetModes.Single,
                    dependsOn: 'shinobi',
                    player: Players.Self,
                    cardType: CardTypes.Character,
                    optional: false,
                    cardCondition: (card, context) =>
                        card.controller === context.player.opponent && card.isParticipating()
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    duration: Durations.UntilEndOfConflict,
                    target: context.targets.shinobi,
                    effect: AbilityDsl.effects.setMilitarySkill(context.targets.enemy.militarySkill)
                })),
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    duration: Durations.UntilEndOfConflict,
                    target: context.targets.shinobi,
                    effect: AbilityDsl.effects.setPoliticalSkill(context.targets.enemy.politicalSkill)
                }))
            ]),
            effect: "set the skills of {1} equal to the skills of {2}. There's no blade as keen as surprise.",
            effectArgs: (context) => [context.targets.shinobi.name, context.targets.enemy.name]
        });
    }
}
