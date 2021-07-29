const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, TargetModes } = require('../../../Constants.js');

class StormOfSteel extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a character a skill bonus',
            condition: context => context.game.isDuringConflict(),
            targets: {
                character: {
                    player: Players.Self,
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isParticipating()
                },
                weapons: {
                    activePromptTitle: 'Choose weapons to bow',
                    dependsOn: 'character',
                    player: Players.Self,
                    mode: TargetModes.Unlimited,
                    cardCondition: (card, context) => card.hasTrait('weapon') && !card.bowed && card.parent === context.targets.character
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.targets.character,
                    effect: AbilityDsl.effects.modifyMilitarySkill(2 * context.targets.weapons.length)
                })),
                AbilityDsl.actions.bow(context => ({
                    target: context.targets.weapons
                }))
            ]),
            effect: 'bow {3} and give {4} +{1}{2}',
            effectArgs: (context) => [2 * context.targets.weapons.length, 'military', context.targets.weapons, context.targets.character]
        });
    }
}

StormOfSteel.id = 'storm-of-steel';
module.exports = StormOfSteel;
