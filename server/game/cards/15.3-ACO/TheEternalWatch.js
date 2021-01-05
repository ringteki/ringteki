const ProvinceCard = require('../../provincecard.js');
const { Players, TargetModes, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class TheEternalWatch extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character or take an honor from your opponent',
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => card.isAttacking() && card.allowGameAction('bow', context)
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Bow this character': AbilityDsl.actions.bow(context => ({
                            target: context.targets.character
                        })),
                        'Give your opponent 1 honor': AbilityDsl.actions.takeHonor()
                    }
                }
            },
            effect: '{1}{2}',
            effectArgs: context => {
                if(context.selects.select.choice === 'Give your opponent 1 honor') {
                    return ['take 1 honor from ', context.player.opponent];
                }
                return ['bow ', context.targets.character];
            }
        });
    }
}

TheEternalWatch.id = 'the-eternal-watch';

module.exports = TheEternalWatch;
