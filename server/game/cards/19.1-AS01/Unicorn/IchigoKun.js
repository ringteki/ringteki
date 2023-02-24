const AbilityDsl = require('../../../abilitydsl.js');
const { Elements, CardTypes, Players, TargetModes } = require('../../../Constants.js');
const DrawCard = require('../../../drawcard.js');

const elementKey = 'ichigo-kun-fire';

class IchigoKun extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.game.currentConflict &&
                context.game.currentConflict.hasElement(this.getCurrentElementSymbol(elementKey)),
            effect: [AbilityDsl.effects.cannotParticipateAsAttacker(), AbilityDsl.effects.cannotParticipateAsDefender()]
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({ cannot: 'applyCovert', restricts: 'opponentsCardEffects' })
        });

        this.action({
            title: 'Modify military skill and glory',
            condition: (context) => context.source.isParticipating(),
            targets: {
                otherCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card.isParticipating() && card !== context.source
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'otherCharacter',
                    choices: (context) => ({
                        'Increase own military, reduce other glory': AbilityDsl.actions.multiple([
                            AbilityDsl.actions.cardLastingEffect({
                                target: context.source,
                                effect: AbilityDsl.effects.modifyMilitarySkill(+2)
                            }),
                            AbilityDsl.actions.cardLastingEffect({
                                target: context.targets.otherCharacter,
                                effect: AbilityDsl.effects.modifyGlory(-2)
                            })
                        ]),
                        'Reduce own military, increase other glory': AbilityDsl.actions.multiple([
                            AbilityDsl.actions.cardLastingEffect({
                                target: context.source,
                                effect: AbilityDsl.effects.modifyMilitarySkill(-2)
                            }),
                            AbilityDsl.actions.cardLastingEffect({
                                target: context.targets.otherCharacter,
                                effect: AbilityDsl.effects.modifyGlory(+2)
                            })
                        ])
                    })
                }
            },
            effect: 'give {0} {1} {2} and {3} {4} glory - {0} {5}',
            effectArgs: (context) =>
                context.selects.select.choice === 'Increase own military, reduce other glory'
                    ? ['+2', 'military', context.targets.otherCharacter, '-2', 'is wild today!']
                    : ['-2', 'military', context.targets.otherCharacter, '+2', 'is well-behaved. Impressive!']
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Restricted Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}

IchigoKun.id = 'ichigo-kun';

module.exports = IchigoKun;
